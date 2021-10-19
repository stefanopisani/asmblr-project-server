const router = require("express").Router();
const Project = require("../models/Project.model");
const fileUpload = require("../config/cloudinary");

router.get("/projects", async (req, res) => {

    try {
        console.log("request", req.session.currentUser)
        // we can protect also in the backend and if req.session.currentUser is undefined don't show projects
        const projects = await Project.find();
        res.status(200).json(projects);
    } catch (e) {
        res.status(500).json({message: e});
    }
});

router.post("/project", async (req, res) => {
    const { title, description, imageUrl } = req.body;

    if (!title || !description || !imageUrl) {
        res.status(400).json({message: "missing fields"});
        return;
    };

    try {
        const response = await Project.create({ title, description, imageUrl});
        res.status(200).json(response);
    } catch (e) {
        res.status(500).json({message: e});
    }
});

router.delete("/projects/:id", async (req, res) => {
try {
    await Project.findByIdAndRemove(req.params.id);
    res.status(200).json({message: `project with id: ${req.params.id} was deleted.`});
} catch (e) {
    res.status(500).json({message: e});
}
});

router.get("/projects/:id", async (req, res) => {
    try {
        const response = await Project.findById(req.params.id);
        res.status(200).json(response);
    } catch (e) {
        res.status(500).json({message: e.message});
    }
});

router.put("/projects/:id", async (req, res) => {
    const { title, description, imageUrl } = req.body;
    if (!title || !description) {
        res.status(400).json({message: "missing fields"});
        return;
    };

    try {
        const response = await Project.findByIdAndUpdate(req.params.id, {
            title,
            description,
        },
        { new: true }
        );
        res.status(200).json(response);
    } catch (e) {
        res.status(500).json({message: e.message});
    }
});

router.post("/upload", fileUpload.single("file"), async (req, res)=> {
    try {
        res.status(200).json({ fileUrl : req.file.path })
    } catch (e) {
        res.status(500).json({message: e.message});
    }
});

module.exports = router;

