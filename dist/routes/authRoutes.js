"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authcontroller_1 = require("../controllers/authcontroller");
const authenticate_1 = require("../middleware/authenticate");
const router = (0, express_1.Router)();
router.post('/login', authcontroller_1.loginUser);
router.get('/getusers', authenticate_1.authenticate, authcontroller_1.getUsers);
exports.default = router;
