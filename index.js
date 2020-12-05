const express = require("express");
const jwt = require("jsonwebtoken");
const app = express();
const port = 3000;
const router = express.Router();
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const adapter = new FileSync("db.json");
const db = low(adapter);
db.defaults({ schedules: [] }).write();

const adapterUser = new FileSync("dbUser.json");
const dbUser = low(adapterUser);
dbUser.defaults({ users: [] }).write();

const fs = require("fs");
const data = JSON.parse(fs.readFileSync("Lab3-timetable-data.json"));

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const expressSanitizer = require("express-sanitizer");
app.use(express.json());
app.use(expressSanitizer());

const cors = require("cors");
app.use(cors());

const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt_decode = require("jwt-decode");
var stringSimilarity = require("string-similarity");

app.use("/", express.static("static"));

app.use("/api", router);

const accessTokenSecret = "jaskanwarRandhawaSecretCode482179";
const authenticateJWT = (req, res) => {
  const authHeader = req.headers.Authorization;
  const token = authHeader.split(" ")[1];
  if (authHeader.exp) {
    console.log("Expired");
  }
  let verification = jwt.verify(token, accessTokenSecret, (err) => {
    if (err) {
      return 404;
    } else {
      return 101;
    }
  });
  return verification;
};

router.post("/login", (req, res) => {
  const loginData = req.body;
  let email = req.sanitize(loginData.emailAddy);
  let passCode = req.sanitize(loginData.pass);
  for (let i = 0; i < dbUser.getState().users.length; i++) {
    if (dbUser.getState().users[i].emailLink === email) {
      //bcrypt.compareSync(someOtherPlaintextPassword, hash);
      //dbUser.getState().users[i].passwordKey === passCode
      if (
        bcrypt.compareSync(passCode, dbUser.getState().users[i].passwordKey)
      ) {
        if (dbUser.getState().users[i].status === "deactivated") {
          res.json({ message: "deactivated" });
          return;
        }
        const accessToken = jwt.sign(
          { emailAddress: email, userPassword: passCode },
          accessTokenSecret,
          { expiresIn: "1h" }
        );
        if (dbUser.getState().users[i].role === "admin") {
          res.json({ accessToken, message: "admin" });
          return;
        }
        res.json({
          accessToken,
          message: "success",
        });
        return;
      }
    }
  }
  res.json({ message: "Username or password incorrect" });
});

router.put("/users", (req, res) => {
  const userData = req.body;
  let name = req.sanitize(userData.name);
  let emailAddress = req.sanitize(userData.emailAddress);
  let passCode = bcrypt.hashSync(req.sanitize(userData.passCode), saltRounds);
  for (let i = 0; i < dbUser.getState().users.length; i++) {
    if (dbUser.getState().users[i].emailLink === emailAddress) {
      res.status(404).send("Email Account already exists.");
      return;
    }
  }
  dbUser
    .get("users")
    .push({
      usersName: name,
      emailLink: emailAddress,
      passwordKey: passCode,
      status: "active",
      role: "user",
    })
    .write();
  dbUser.update("users").write();
  res.status(200).send("Success");
});

router.get("/", (req, res) => {
  let arr = [];
  for (let i = 0; i < data.length; i++) {
    arr.push(data[i]);
  }
  res.send(arr);
});

//Task 1
router.get("/course", (req, res) => {
  res.send(parse_classname());
});

function parse_classname() {
  let dis_subjects = {};
  for (let i = 0; i < data.length; i++) {
    dis_subjects[`Subject: ${i}`] = data[i].subject;
    dis_subjects[`Class name: ${i}`] = data[i].className;
  }
  return dis_subjects;
}

//Task 2
router.get("/:classes_subjects", (req, res) => {
  const subjects = req.sanitize(
    req.params.classes_subjects.toString().toUpperCase()
  );
  const classes = data.filter(
    (c) => c.subject.toString().toUpperCase() === subjects
  );
  if (classes.length !== 0) {
    res.send(parse_courseCode(classes));
  } else {
    res.status(404).send(`Subject ${subjects} was not found, try again.`);
  }
});

function parse_courseCode(subject) {
  let dis_catalog = [];
  dis_catalog.subject = subject[0].subject;
  for (let i = 0; i < subject.length; i++) {
    dis_catalog.push(subject[i].catalog_nbr);
  }
  return dis_catalog;
}

//Task 3
router.get(
  "/timetable/:classes_subjects/:course_code/:course_component?",
  (req, res) => {
    const subjects = data.filter(
      (c) =>
        c.subject.toString().toUpperCase() ===
        req.sanitize(req.params.classes_subjects.toString().toUpperCase())
    );
    const course_code = subjects.filter((c) =>
      c.catalog_nbr
        .toString()
        .toUpperCase()
        .includes(req.sanitize(req.params.course_code.toString().toUpperCase()))
    );
    if (subjects.length === 0 || course_code.length === 0) {
      res
        .status(404)
        .send(
          `Subject ${subjects} was not found or course code ${course_code} was not found.`
        );
    }
    if (
      course_code.filter(
        (c) =>
          c.course_info[0].ssr_component.toUpperCase() ===
          req.sanitize(req.params.course_component)
      )
    ) {
      res.send(course_code);
    } else {
      res.send(course_code);
    }
  }
);

//Task 4
router.put("/schedule/:name/:auth_token", (req, res) => {
  const token = req.sanitize(req.params.auth_token);
  const jsonToken = JSON.parse(token);
  let decode = jwt_decode(token);
  console.log(authenticateJWT(jsonToken));
  if (authenticateJWT(jsonToken) == 101) {
    const name = req.sanitize(req.params.name);
    for (let i = 0; i < db.getState().schedules.length; i++) {
      if (db.getState().schedules[i].scheduleName === name) {
        res.status(404).send("Name already exists.");
        return;
      }
    }
    db.get("schedules")
      .push({
        scheduleName: name,
        subject: [],
        courseName: [],
        user: decode.emailAddress,
      })
      .write();
    res.status(200).send();
  } else {
    res.json({ message: "failed" });
  }
});

//Task 5
router.put("/write/schedule/:name/:auth_token", (req, res) => {
  const token = req.sanitize(req.params.auth_token);
  const jsonToken = JSON.parse(token);
  if (authenticateJWT(jsonToken) == 101) {
    const name = req.sanitize(req.params.name);
    const schedule = req.body;
    let subCode = req.sanitize(schedule.subject);
    let courCode = req.sanitize(schedule.catalog_nbr);
    console.log(subCode);
    let subject = JSON.parse(`"${subCode}"`);
    let course = JSON.parse(`"${courCode}"`);
    for (let i = 0; i < db.getState().schedules.length; i++) {
      if (db.getState().schedules[i].scheduleName === name) {
        for (let j = 0; j < db.getState().schedules[i].courseName.length; j++) {
          if (
            db.getState().schedules[i].courseName[j].toUpperCase() ===
              course.toUpperCase() &&
            db.getState().schedules[i].subject[j].toUpperCase() ===
              subject.toUpperCase()
          ) {
            db.getState().schedules[i].subject = subject;
            db.getState().schedules[i].courseName = course;
            db.update("schedules").write();
            res.status(200).send("Added");
            return;
          }
        }
        db.getState().schedules[i].courseName.push(course);
        db.getState().schedules[i].subject.push(subject);
        db.update("Schedule").write();
        res.status(200).send("Added");
        return;
      }
    }
    res.status(404).send("ERROR not added");
  } else {
    res.json({ message: "failed" });
  }
});

//Task 6
router.get("/display/schedule/:name/:auth_token", (req, res) => {
  const token = req.sanitize(req.params.auth_token);
  const jsonToken = JSON.parse(token);
  if (authenticateJWT(jsonToken) == 101) {
    let name = req.sanitize(req.params.name);
    console.log(name);
    let dispSchedule = [];
    for (let i = 0; i < db.getState().schedules.length; i++) {
      if (db.getState().schedules[i].scheduleName === name) {
        for (let j = 0; j < db.getState().schedules[i].courseName.length; j++) {
          let dispsubject = db.getState().schedules[i].subject[j];
          let dispCourse = db.getState().schedules[i].courseName[j];
          const course = data.filter(
            (a) =>
              a.subject.toString().toLowerCase() ===
              req.sanitize(dispsubject.toString().toLowerCase())
          );
          const final = course.filter(
            (a) =>
              a.catalog_nbr.toString().toUpperCase() ===
              req.sanitize(dispCourse.toString().toUpperCase())
          );
          dispSchedule.push(final);
        }
        res.send(JSON.stringify(dispSchedule));
        return;
      }
    }
    res.status(404).send("Schedule not found");
  } else {
    res.json({ message: "failed" });
  }
});

//Task 7
router.post("/schedule/:name/:auth_token", (req, res) => {
  const token = req.sanitize(req.params.auth_token);
  const jsonToken = JSON.parse(token);
  if (authenticateJWT(jsonToken) == 101) {
    let sName = req.sanitize(req.params.name);
    console.log(sName);
    for (let i = 0; i < db.getState().schedules.length; i++) {
      if (db.getState().schedules[i].scheduleName === sName) {
        db.get("schedules").remove({ scheduleName: sName }).write();
        res.status(200).send("Schedule has been removed.");
      }
    }
    res.status(404).send("Name doesn't exist");
  } else {
    res.json({ message: "failed" });
  }
});

//Task 8
router.get("/disp/schedule/:auth_token", (req, res) => {
  const token = req.sanitize(req.params.auth_token);
  const jsonToken = JSON.parse(token);
  if (authenticateJWT(jsonToken) == 101) {
    let scheduleList = [];
    for (let i = 0; i < db.getState().schedules.length; i++) {
      scheduleList.push(
        `Schedule name:${
          db.getState().schedules[i].scheduleName
        }, Number of courses:${db.getState().schedules[i].courseName[i].length}`
      );
    }
    res.send(scheduleList);
  } else {
    res.json({ message: "failed" });
  }
});

//Task9
router.post("/delete/schedules/:auth_token", (req, res) => {
  const token = req.sanitize(req.params.auth_token);
  const jsonToken = JSON.parse(token);
  if (authenticateJWT(jsonToken) == 101) {
    for (let i = 0; i < db.getState().schedules.length; i++) {
      db.set("schedules", []).write();
      res.send("done");
    }
  } else {
    res.json({ message: "failed" });
  }
});

router.get("/fill/users/:auth_token", (req, res) => {
  const token = req.sanitize(req.params.auth_token);
  const jsonToken = JSON.parse(token);
  console.log("poopoo");
  if (authenticateJWT(jsonToken) == 101) {
    let userList = [];
    for (let i = 0; i < dbUser.getState().users.length; i++) {
      if (dbUser.getState().users[i].role === "user") {
        userList.push(dbUser.getState().users[i].emailLink);
      }
    }
    res.send(userList);
  } else {
    res.json({ message: "failed" });
  }
});

router.post("/admin/:user/:auth_token", (req, res) => {
  console.log("poopoo");
  const token = req.sanitize(req.params.auth_token);
  const jsonToken = JSON.parse(token);
  let userEmail = req.sanitize(req.params.user);
  if (authenticateJWT(jsonToken) == 101) {
    for (let i = 0; i < dbUser.getState().users.length; i++) {
      if (dbUser.getState().users[i].emailLink === userEmail) {
        dbUser.getState().users[i].role = "admin";
        dbUser.update("users").write();
      }
    }
    res.send("done");
  } else {
    res.json({ message: "failed" });
  }
});

router.post("/deactivate/:user/:auth_token", (req, res) => {
  console.log("poopoo");
  const token = req.sanitize(req.params.auth_token);
  const jsonToken = JSON.parse(token);
  let userEmail = req.sanitize(req.params.user);
  if (authenticateJWT(jsonToken) == 101) {
    for (let i = 0; i < dbUser.getState().users.length; i++) {
      if (dbUser.getState().users[i].emailLink === userEmail) {
        dbUser.getState().users[i].status = "deactivated";
        dbUser.update("users").write();
      }
    }
    res.send("done");
  } else {
    res.json({ message: "failed" });
  }
});

router.post("/activate/:user/:auth_token", (req, res) => {
  console.log("poopoo");
  const token = req.sanitize(req.params.auth_token);
  const jsonToken = JSON.parse(token);
  let userEmail = req.sanitize(req.params.user);
  if (authenticateJWT(jsonToken) == 101) {
    for (let i = 0; i < dbUser.getState().users.length; i++) {
      if (dbUser.getState().users[i].emailLink === userEmail) {
        dbUser.getState().users[i].status = "active";
        dbUser.update("users").write();
      }
    }
    res.send("done");
  } else {
    res.json({ message: "failed" });
  }
});

router.get("/keyword/:keyword", (req, res) => {
  let keyword = req.sanitize(req.params.keyword);
  let arr = [];
  for (let i = 0; i < data.length; i++) {
    if (
      stringSimilarity.compareTwoStrings(
        keyword.toUpperCase(),
        JSON.stringify(data[i].className)
      ) > 0.6
    ) {
      arr.push(data[i]);
    }
    if (
      stringSimilarity.compareTwoStrings(
        keyword.toUpperCase(),
        JSON.stringify(data[i].catalog_nbr)
      ) > 0.44
    ) {
      arr.push(data[i]);
    }
  }
  console.log(arr);
  res.send(arr);
});

router.post("/change/:email/:password/:auth_token", (req, res) => {
  console.log("poopoo");
  const token = req.sanitize(req.params.auth_token);
  const jsonToken = JSON.parse(token);
  if (authenticateJWT(jsonToken) == 101) {
    let email = req.sanitize(req.params.email);
    let password = req.sanitize(req.params.password);
    let body = req.body;
    let newpassword = body.password;
    for (let i = 0; i < dbUser.getState().users.length; i++) {
      if (dbUser.getState().users[i].emailLink === email) {
        if (
          bcrypt.compareSync(password, dbUser.getState().users[i].passwordKey)
        ) {
          dbUser.getState().users[i].passwordKey = bcrypt.hashSync(
            newpassword,
            saltRounds
          );
          dbUser.update("Users").write();
          return;
        }
      }
    }
  } else {
    res.json({ message: "failed" });
  }
});

app.listen(port, () => {
  console.log("Listening on port" + port);
});
