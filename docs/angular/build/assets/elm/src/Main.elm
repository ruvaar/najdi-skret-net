port module Main exposing (main)

import Acceleration
import Angle
import Axis3d exposing (Axis3d)
import Block3d exposing (Block3d)
import Browser
import Browser.Dom
import Browser.Events
import Camera3d exposing (Camera3d)
import Color
import Direction3d
import Duration exposing (seconds)
import Html exposing (Html)
import Html.Attributes
import Html.Events
import Json.Decode exposing (Decoder)
import Length exposing (Meters, millimeters)
import Mass exposing (kilograms)
import Physics.Body as Body exposing (Body)
import Physics.Constraint as Constraint
import Physics.Coordinates exposing (BodyCoordinates, WorldCoordinates)
import Physics.Shape
import Physics.World as World exposing (RaycastResult, World)
import Pixels exposing (Pixels, pixels)
import Plane3d
import Point2d
import Point3d
import Quantity exposing (Quantity)
import Rectangle2d
import Scene3d
import Scene3d.Material exposing (Texture)
import Scene3d.Mesh exposing (Shadow, Textured)
import Sphere3d
import Task
import Viewpoint3d
import WebGL.Texture
import Http
import Color exposing (Color)
import Obj.Decode exposing (Decoder, ObjCoordinates)
import Frame3d exposing (Frame3d)
import Physics.Coordinates exposing (BodyCoordinates)
import Vector3d
import Scene3d.Material as Material

bodyFrame : Frame3d Meters BodyCoordinates { defines : ObjCoordinates }
bodyFrame =
    Frame3d.atOrigin

type Id
    = Mouse
    | Floor
    | Poop
    | Toilet


type State
    = BeforeThrow
    | Throwing Int
    | AfterThrow

type alias Model =
    { world : World Id
    , width : Quantity Float Pixels
    , height : Quantity Float Pixels
    , maybeRaycastResult : Maybe (RaycastResult Id)
    , game: State
    , stopped: Bool
    , poopModel : Maybe Meshy
    }


port stop : (Bool -> msg) -> Sub msg

type Msg
    = AnimationFrame
    | Resize Int Int
    | MouseDown (Axis3d Meters WorldCoordinates)
    | MouseMove (Axis3d Meters WorldCoordinates)
    | MouseUp
    | Stop Bool
    | LoadedPoop (Result Http.Error Meshy)


type alias Meshy = Scene3d.Mesh.Mesh BodyCoordinates { normals : () }


meshes : Decoder Meshy
meshes =
    Obj.Decode.map
        (\fcs ->
            let
                mesh =
                    Scene3d.Mesh.indexedFaces fcs
                        |> Scene3d.Mesh.cullBackFaces
            in
            (mesh)
        )
        (Obj.Decode.facesIn bodyFrame)


main : Program () Model Msg
main =
    Browser.element
        { init = init
        , update = \msg model -> ( update msg model, Cmd.none )
        , subscriptions = subscriptions
        , view = view
        }


init : () -> ( Model, Cmd Msg )
init _ =
    ( { world = initialWorld
      , width = pixels 0
      , height = pixels 0
      , maybeRaycastResult = Nothing
      , game = BeforeThrow
      , stopped = False
      , poopModel = Nothing
      }
    , Cmd.batch
        [ Http.get
              { url = "/assets/elm/poop.obj.txt"
              , expect = Obj.Decode.expectObj LoadedPoop Length.meters meshes
              }
        , Task.perform
        (\{ viewport } ->
            Resize (round viewport.width) (round viewport.height)
        )
        Browser.Dom.getViewport
        ]
    )


subscriptions : Model -> Sub Msg
subscriptions _ =
    Sub.batch
        [ Browser.Events.onResize Resize
        , Browser.Events.onAnimationFrame (\_ -> AnimationFrame)
        , stop Stop
        ]


initialWorld : World Id
initialWorld =
    World.empty
        |> World.withGravity (Acceleration.gees 1) Direction3d.negativeZ
        |> World.add (skret |> Body.translateBy (Vector3d.meters -1 -1 0))
        |> World.add poop
        |> World.add (Body.plane Floor)


skret: Body Id
skret =
    Body.compound (List.map Physics.Shape.block skretModel) Toilet
        |> Body.withBehavior Body.static

skretModel : List (Block3d Meters BodyCoordinates)
skretModel =
    [Block3d.from
         (Point3d.meters -1 1 1)
         (Point3d.meters 1 0.8 0)
    , Block3d.from
         (Point3d.meters -1 -1 1)
         (Point3d.meters 1 -0.8 0)
    , Block3d.from
         (Point3d.meters -1 1 1)
         (Point3d.meters -0.8 -1 0)
    , Block3d.from
         (Point3d.meters 1 1 1)
         (Point3d.meters 0.8 -1 0)
    ]
    |> List.map (\n -> n |> Block3d.scaleAbout (Point3d.origin) 0.5)

poop: Body Id
poop =
    Body.sphere (Sphere3d.atOrigin (Length.meters 0.3)) Poop
        |> Body.withBehavior (Body.dynamic (kilograms 1))
        |> Body.rotateAround Axis3d.x (Angle.degrees 90)
        |> Body.translateBy (Vector3d.meters 0 0 1)



camera : Camera3d Meters WorldCoordinates
camera =
    Camera3d.perspective
        { viewpoint =
            Viewpoint3d.lookAt
                { eyePoint = Point3d.meters 3 4 4
                , focalPoint = Point3d.meters -0.5 -0.5 0
                , upDirection = Direction3d.positiveZ
                }
        , verticalFieldOfView = Angle.degrees 24
        }


view : Model -> Html Msg
view { world, width, height, stopped, poopModel} =
    case (stopped, poopModel) of
        (True, _) ->
            Html.div [] []
        (_, Nothing) ->
            Html.div [] [Html.text "Loadin..."]
        (False, Just m) ->
            Html.div
                [ Html.Attributes.style "position" "fixed"
                , Html.Attributes.style "left" "0"
                , Html.Attributes.style "top" "10vh"
                , Html.Events.on "mousedown" (decodeMouseRay camera width height MouseDown)
                , Html.Events.on "mousemove" (decodeMouseRay camera width height MouseMove)
                , Html.Events.onMouseUp MouseUp
                ]
                [ Scene3d.sunny
                    { upDirection = Direction3d.z
                    , sunlightDirection = Direction3d.xyZ (Angle.degrees 135) (Angle.degrees -60)
                    , shadows = True
                    , camera = camera
                    , dimensions =
                        ( Pixels.int (round (Pixels.toFloat width))
                        , Pixels.int (round (Pixels.toFloat height))
                        )
                    , background = Scene3d.transparentBackground
                    , clipDepth = Length.meters 0.1
                    , entities = List.map (bodyToEntity m) (World.bodies world)
                    }
                ]


bodyToEntity : Meshy -> (Body Id) ->  Scene3d.Entity WorldCoordinates
bodyToEntity m body =
    let
        frame =
            Body.frame body

        id =
            Body.data body
    in
    Scene3d.placeIn frame <|
        case id of
            Mouse ->
                Scene3d.sphere (Scene3d.Material.matte Color.white)
                    (Sphere3d.atOrigin (millimeters 20))

            Poop ->
                Scene3d.group
                    [ Scene3d.mesh
                        (Scene3d.Material.nonmetal
                            { baseColor = Color.brown
                            , roughness = 1.0}
                        )
                        m
                        |> Scene3d.scaleAbout (Point3d.origin) 0.3
                        |> Scene3d.translateBy (Vector3d.meters 0 0.1 0)
                    -- , Scene3d.sphere (Scene3d.Material.nonmetal {baseColor= Color.white, roughness = 0.5}) (Sphere3d.atOrigin (Length.meters 0.3))
                    ]

            Floor ->
                Scene3d.quad (Scene3d.Material.matte Color.darkCharcoal)
                    (Point3d.meters -15 -15 0)
                    (Point3d.meters -15 15 0)
                    (Point3d.meters 15 15 0)
                    (Point3d.meters 15 -15 0)
            Toilet ->
                skretModel
                   |> List.map (
                       Scene3d.blockWithShadow
                                            (Material.nonmetal
                                                 { baseColor = Color.white
                                                 , roughness = 0.0 }
                                            )
                                       )

                    |> Scene3d.group

update : Msg -> Model -> Model
update msg model =
        case msg of
            AnimationFrame ->
                { model | world = World.simulate (seconds (1 / 60)) model.world }

            Resize width height ->
                { model
                    | width = Pixels.float (toFloat width)
                    , height = Pixels.float (toFloat height)
                }

            MouseDown mouseRay ->
                case World.raycast mouseRay model.world of
                    Just raycastResult ->
                        case Body.data raycastResult.body of
                            Poop ->
                                let
                                    worldPoint =
                                        Point3d.placeIn
                                            (Body.frame raycastResult.body)
                                            raycastResult.point

                                    mouse =
                                        Body.compound [] Mouse
                                            |> Body.moveTo worldPoint
                                in
                                { model
                                    | maybeRaycastResult = Just raycastResult
                                    , world =
                                        model.world
                                            |> World.add mouse
                                            |> World.constrain
                                                (\b1 b2 ->
                                                    case ( Body.data b1, Body.data b2 ) of
                                                        ( Mouse, Poop ) ->
                                                            [ Constraint.pointToPoint
                                                                Point3d.origin
                                                                raycastResult.point
                                                            ]

                                                        _ ->
                                                            []
                                                )
                                }

                            _ ->
                                model

                    Nothing ->
                        model

            MouseMove mouseRay ->
                case model.maybeRaycastResult of
                    Just raycastResult ->
                        let
                            worldPoint =
                                Point3d.placeIn
                                    (Body.frame raycastResult.body)
                                    raycastResult.point

                            plane =
                                Plane3d.through
                                    worldPoint
                                    (Viewpoint3d.viewDirection (Camera3d.viewpoint camera))
                        in
                        { model
                            | world =
                                World.update
                                    (\body ->
                                        if Body.data body == Mouse then
                                            case Axis3d.intersectionWithPlane plane mouseRay of
                                                Just intersection ->
                                                    Body.moveTo intersection body

                                                Nothing ->
                                                    body

                                        else
                                            body
                                    )
                                    model.world
                        }

                    Nothing ->
                        model

            MouseUp ->
                { model
                    | maybeRaycastResult = Nothing
                    , world =
                        World.keepIf
                            (\body -> Body.data body /= Mouse)
                            model.world
                }
            Stop s ->
                {model | stopped = s}
            LoadedPoop a ->
                {model | poopModel = a |> Result.toMaybe}

decodeMouseRay :
    Camera3d Meters WorldCoordinates
    -> Quantity Float Pixels
    -> Quantity Float Pixels
    -> (Axis3d Meters WorldCoordinates -> msg)
    -> Json.Decode.Decoder msg
decodeMouseRay camera3d width height rayToMsg =
    Json.Decode.map2
        (\x y  ->
            rayToMsg
                (Camera3d.ray
                    camera3d
                    (Rectangle2d.with
                        { x1 = pixels 0
                        , y1 = height
                        , x2 = width
                        , y2 = pixels 0
                        }
                    )
                    (Point2d.pixels x y)
                )
        )
        (Json.Decode.field "offsetX" Json.Decode.float)
        (Json.Decode.field "offsetY" Json.Decode.float)
