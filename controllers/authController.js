import User from "../model/schemas/User.js";
import { isEqual } from "../utils/helper.js";

export async function checkAuth(req, res, next) {
    if (req.session.user) {
        const user = await User.findById(req.session.user._id).lean();
        if (!isEqual(user, req.session.user)) req.session.user = user;
        return next();
    }
    res.redirect("/login");
}

export function checkNoAuth(req, res, next) {
    if (req.session.user) {
        return res.redirect("/");
    }
    next();
}
