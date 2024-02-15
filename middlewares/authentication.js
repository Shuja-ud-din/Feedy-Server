import jwt from "jsonwebtoken";

const user = {
    _id: "fwefweef",
    name: "John"
}

const authentication = async (req, res, next) => {
    const token = req.header("authorization") && req.header("authorization").split(" ")[1];

    if (token) {
        try {
            jwt.verify(token, process.env.JWT_SECRET);
            next();
        }
        catch {
            res.send("Invalid Token")
        }
    }
    else {
        res.status(401).send("Authenticate Please");
    }
}

const adminAuthentication = async (req, res, next) => {
    const token = req.header("authorization") && req.header("authorization").split(" ")[1];

    if (token) {
        try {
            const userObj = jwt.verify(token, process.env.JWT_SECRET);
            if (userObj.role === "admin") {
                next();
            } else {
                res.send("You are not an admin")
            }
        }
        catch {
            res.send("Invalid Token")
        }
    }
    else {
        res.status(401).send("Authenticate Please");
    }
}

export { authentication, adminAuthentication }