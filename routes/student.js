const express = require("express");
const router = express.Router();
const Student = require("../models/Student");

const validateStudentInfo = (info) => {
  const errors = {};
  if (info.firstname == null || info.firstname == "") {
    errors.firstname = "First Name is required";
  }
  if (info.lastname == null || info.lastname == "") {
    errors.lastname = "Last Name is required";
  }

  return errors;
};

// Get a list of students
router.get("/", (req, res) => {
  const query = {};
  if (req.query.firstname) {
    query.firstname = {'$regex': req.query.firstname ,$options:'i'};
  }
  if (req.query.lastname) {
    query.lastname = {'$regex': req.query.lastname ,$options:'i'};
  }
  Student.find(query)
    .then((students) => {
      res.send(students);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({ message: "Server Internal Error!" });
    });
});

// Get one student
router.get("/:id", (req, res) => {
  Student.findById(req.params.id)
    .then((student) => {
      if (student) {
        res.send(student);
      } else {
        res.status(404).send({ message: "Student not found!" });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({ message: "Server Internal Error!" });
    });
});

// Create a student
router.post("/", (req, res) => {
  const errors = validateStudentInfo(req.body);

  if (Object.keys(errors).length > 0) {
    res.status(400).send(errors);
  } else {
    const newStudent = new Student({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
    });

    newStudent
      .save()
      .then((student) => {
        res.status(201).send(student);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send({ message: "Server Internal Error!" });
      });
  }
});

// Update a student info
router.put("/:id", (req, res) => {
  const errors = validateStudentInfo(req.body);

  if (Object.keys(errors).length > 0) {
    res.status(400).send(errors);
  } else {
    Student.findById(req.params.id)
      .then((student) => {
        if (student) {
          student.firstname = req.body.firstname;
          student.lastname = req.body.lastname;
          return student.save();
        } else {
          res.status(404).send({ message: "Student not found!" });
        }
      })
      .then((student) => {
        res.send(student);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send({ message: "Server Internal Error!" });
      });
  }
});

// Delete a student
router.delete("/:id", (req, res) => {
  Student.findByIdAndDelete(req.params.id)
    .then(() => {
      res.status(204).send({ message: "Delete student successfully!" });
    })
    .catch((err) => {
      res.status(404).send({ message: "Student not found!" });
    });
});

module.exports = router;
