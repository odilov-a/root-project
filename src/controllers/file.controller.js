const fs = require("fs");
const crypto = require("crypto");
const File = require("../models/File.js");

exports.uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    const { receiverId } = req.body;
    if (!receiverId) {
      return res.status(400).json({ message: "Receiver ID is required" });
    }
    const file = new File({
      senderId: req.userId,
      receiverId,
      filename: req.file.originalname,
      filePath: req.file.path,
    });
    await file.save();
    return res.status(201).json({ data: file });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.getReceivedFiles = async (req, res) => {
  try {
    const files = await File.find({ receiverId: req.userId })
      .populate("senderId", "username")
      .sort({ createdAt: -1 });
    return res.status(200).json({ data: files });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.signFile = async (req, res) => {
  try {
    const { id } = req.params; // ✅ URL-dan ID olish
    const file = await File.findById(id);
    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }
    if (file.receiverId.toString() !== req.userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const fileBuffer = fs.readFileSync(file.filePath);
    const privateKey = crypto.createPrivateKey(fs.readFileSync("private.pem"));
    const sign = crypto.createSign("SHA256");
    sign.update(fileBuffer);
    const signature = sign.sign(privateKey, "base64");

    file.signature = signature;
    file.status = "signed";
    await file.save();

    return res
      .status(200)
      .json({ data: file, message: "File signed successfully!" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.verifyFile = async (req, res) => {
  try {
    const { id } = req.params; // ✅ URL-dan ID olish
    const file = await File.findById(id);
    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }
    if (!file.signature) {
      return res.status(400).json({ message: "File not signed yet" });
    }

    const fileBuffer = fs.readFileSync(file.filePath);
    const publicKey = crypto.createPublicKey(fs.readFileSync("public.pem"));
    const verify = crypto.createVerify("SHA256");
    verify.update(fileBuffer);
    const isValid = verify.verify(publicKey, file.signature, "base64");

    if (isValid) {
      return res.status(200).json({ message: "Signature is valid" });
    } else {
      return res.status(400).json({ message: "Invalid signature" });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
