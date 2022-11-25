import User from "../model/schemas/User.js";
import { isEqual } from "../utils/helper.js";

export async function checkAuth(req, res, next) {
    if (req.session.user) {
        const user = await User.findById(req.session.user._id).lean();
        if (!isEqual(user, req.session.user)) req.session.user = user;

        // check if suspended
        if (!req.session.user.isSuspended) {
            return next();
        } else {
            if (req.session.viewPage) {
                delete req.session.viewPage;
                req.session.error = "Account suspended";
                return res.redirect("/login");
            } else {
                res.status(403).json({ message: "User is suspended" });
                return;
            }
        }
    }

    if (req.session.viewPage) {
        delete req.session.viewPage;
        res.redirect("/login");
    } else {
        res.status(401).json({ message: "User not logged in" });
    }
}

export function checkNoAuth(req, res, next) {
    if (req.session.user) {
        if (req.session.viewPage) {
            delete req.session.viewPage;
            return res.redirect("/");
        } else {
            req.session.warning.message = "User is logged in";
        }
    }
    next();
}

export function viewPage(req, res, next) {
    req.session.viewPage = true;
    next();
}
