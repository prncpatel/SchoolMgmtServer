const mongoose = require('mongoose');

// Function to create a new school database dynamically
const createNewSchoolDB = async (schoolName) => {
    try {
        schoolName = schoolName.replace(/\s+/g, '').trim();
        const newDbURI = `mongodb+srv://prnckhant:prince1234@princecluster.ys0kc.mongodb.net/${schoolName}?retryWrites=true&w=majority&appName=PrinceCluster`;

        const newDbConnection = await mongoose.createConnection(newDbURI);

        newDbConnection.on('connected', () => {
            console.log(`Connected to new school database: ${schoolName}`);
        });

        // Define a new schema for students (just a basic example)
        const studentSchema = new mongoose.Schema({
            name: String,
            age: Number,
            class: String,
            createdAt: { type: Date, default: Date.now },
        });

        // Create a model and a collection for students in the new database
        const Student = newDbConnection.model('Student', studentSchema);

        // Insert an initial dummy student to ensure the collection is created
        await Student.create({
            name: 'John Doe',
            age: 16,
            class: '10th Grade',
        });

        console.log(`New School Database ${schoolName} created successfully`);

        // You can define your models here for the new database (like Student, Teacher, etc.)
        // const StudentModel = newDbConnection.model('Student', studentSchema);

        return newDbConnection;
    } catch (error) {
        console.error(`Error creating new school DB: ${error.message}`);
        throw new Error('Failed to create new school database');
    }
};

module.exports = createNewSchoolDB;
