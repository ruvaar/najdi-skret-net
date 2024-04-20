const utf8 = require("utf8-encoder");
const mongoose = require("mongoose");
const ToiletModel = mongoose.model("toilets");
const fs = require('fs');
const path = require('path');

var getToilets = async (req, res) => {
    try {
        let toilets = await ToiletModel.find({});
        if(toilets){
            res.status(200).json(toilets)
        } else {
            res.status(400).json({"Error": "Bad request."})
        }
    } catch (error) {
        res.status(500).json({error: "Internal Server Error"});
    }
};

var newToilet = async (req, res) => {
    try {
        const toilet = req.body;
        const newToilet = new ToiletModel(toilet);
        await newToilet.save();
        res.status(201).json(newToilet);
    } catch (error) {
        res.status(500).json({error: "Internal Server Error"});
    }
};

var updateToilet = async (req, res) => {
    var toiletId = req.params.toilet_id;
    if(!req.body.mail && !req.body.region && !req.body.type_of_work && !req.body.working_hours && !req.body.description){
        res.status(400).json({"Error": "Missing parameters."});
    } else {
        try{
            let existingToilet = await ToiletModel.findById(toiletId).exec();
            if(!existingToilet){
                res.status(404).json({"Error":"Toilet not found."});
            } else{
                if(req.body.avgRating){
                    existingToilet.avgRating = req.body.avgRating;
                }
                await existingToilet.save();
                res.status(200).json(existingToilet);
            }
        } catch(error){
            res.status(500).json({error: "Internal Server Error"});
        }
    }
    
};

var deleteToilet = async (req, res) => {
    var toiletId = req.params.toilet_id;
    if (!toiletId)
        res.status(400).json({"Error": "Missing toilet ID."});
    else {
        try {
            let result = await ToiletModel.findByIdAndDelete(toiletId);
            if (!result)
                res.status(404).json({"Error": "Toilet not found."});
            else
                res.status(204).send();
        } catch (error) {
            res.status(500).json({error: "Internal Server Error"});
        }
    }
};

var deleteToilets = async (req, res) => {
    try {
      let result = await ToiletModel.deleteMany({});
      if (!result) {
        res.status(404).json({ "Error": "No toilets found to delete." });
      } else {
        res.status(204).send();
      }
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = {
    getToilets,
    newToilet, 
    updateToilet,
    deleteToilet,
    deleteToilets
};
