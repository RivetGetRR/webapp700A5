//As recommended by linked Code in assignment
//Same code as assignment 2 as recommended in the instructions
const fs = require('fs');

class Data{
    students;
    courses;

    constructor(students, courses){
        this.students = students;
        this.courses = courses
    }
}

var dataCollection = null;

module.exports.initialize = function(){
    return new Promise(function(resolve,reject){

        try{
            //Code copied from assignment instructions
            fs.readFile('data/students.json', 'utf8', function(err, dataFromSomeFile){
                if (err){
                    //Error or Fail 
                reject("=ERROR= - Unable to retrieve Student Data from students.json! More Information: " +  err);
                return; // exit the function
                }
                
                let studentDataFromFile = JSON.parse(dataFromSomeFile); // convert the JSON from the file into an array of objects
                fs.readFile('data/courses.json', 'utf8', function(err, dataFromSomeFile){
                    if (err){
                    //Error or Fail
                    reject("=ERROR= - Unable to retrieve Course Data from courses.json! More Information: " + err);
                    return; // exit the function
                    }
                    //Success? The continue
                    let courseDataFromFile = JSON.parse(dataFromSomeFile); // convert the JSON from the file into an array of objects
                    //console.log(studentDataFromFile[1]);
                    dataCollection = new Data(studentDataFromFile,courseDataFromFile);
                    resolve("Date Retreival Successful");
                });
            });
            //resolve("CHECK-1");
        }catch(err){
            reject("Unknown Error Occured - Unable to Retreive Data: " + err);
        }
    });
}

module.exports.getAllStudents = function(){
    return new Promise(function(resolve,reject){
        try{
            let info = dataCollection.students;
            //console.log(info);
            if(info.length == 0){
                reject("No Results Returned..");
            }else{
                resolve(info);
            }
        }catch(err){
            reject("Unknown Error Occured - Unable to Fetch Student Data: " + err);
        }
    });
}

module.exports.getTAs = function(){
    return new Promise(function(resolve,reject){
        try{
            let arrayTAs = [];
            let info = dataCollection.students;
            if(info.length == 0){
                reject("No Results Returned..");
            }else{
                for(let i = 0; i < info.length; ++i){
                    if(info[i].TA == true){
                        arrayTAs.push(info[i]);
                    }
                }
                if(arrayTAs.length == 0){
                    reject("No TAs Found/Returned..");
                }else{
                    resolve(arrayTAs);
                }
            }
        }catch(err){
            reject("Unknown Error Occured - Unable to Fetch TA Data: " + err);
        }
    });
}

module.exports.getCourses = function(){
    return new Promise(function(resolve,reject){
        try{
            let info = dataCollection.courses;
            if(info.length == 0){
                reject("No Results Returned..");
            }else{
                resolve(info);
            }
        }catch(err){
            reject("Unknown Error Occured - Unable to Fetch Course Data: " + err);
        }
    });
}
//copy pasted from above modules previously made by me - ask about this
module.exports.getStudentsByCourse = function(course){
    return new Promise(function(resolve,reject){
        try{
            let arrayStudentsInCourse = [];
            let info = dataCollection.students;
            if(info.length == 0){
                reject("No Results Returned..");
            }else{
                for(let i = 0; i < info.length; ++i){
                    if(info[i].course == course){
                        arrayStudentsInCourse.push(info[i]);
                    }
                }
                if(arrayStudentsInCourse.length == 0){
                    reject("No Students Found/Returned For Course " + course + "..");
                }else{
                    resolve(arrayStudentsInCourse);
                }
            }
        }catch(err){
            reject("Unknown Error Occured - Unable to Fetch Student Data: " + err);
        }
    });
}

//issue with data retrival -> undefined but not undefined -> refer assignemnet 2 test?
module.exports.getStudentByNum = function(num){
    return new Promise(function(resolve,reject){
        try{
            let returnStudentObj;
            let info = dataCollection.students;
            if(info.length == 0){
                reject("No Results Returned..");
            }else{
                for(let i = 0; i < info.length; ++i){
                    if(info[i].studentNum == num){
                        returnStudentObj = info[i];
                        break;
                    }
                }
                if(returnStudentObj == undefined){
                    reject("No Student Found/Returned For That Student Number (" + num + ")..");
                }else{
                    resolve(returnStudentObj);
                }
            }
        }catch(err){
            reject("Unknown Error Occured - Unable to Fetch Student Data: " + err);
        }
    });
}

//Get Course by Id
module.exports.getCourseById = function(id){
    return new Promise(function(resolve,reject){
        try{
            let returnCourseObj;
            let info = dataCollection.courses;
            if(info.length == 0){
                reject("No Results Returned..");
            }else{
                for(let i = 0; i < info.length; ++i){
                    if(info[i].courseId == id){
                        returnCourseObj = info[i];
                        break;
                    }
                }
                if(returnCourseObj == undefined){
                    reject("No Course Found/Returned For That Course Id (" + id + ")..");
                }else{
                    resolve(returnCourseObj);
                }
            }
        }catch(err){
            reject("Unknown Error Occured - Unable to Fetch Course Data: " + err);
        }
    });
}

module.exports.addStudent = function(studentData){
    return new Promise(function(resolve,reject){
        try{
            let info = dataCollection.students;
            if(studentData.TA == undefined){
                studentData.TA = false;
            }else{
                studentData.TA = true;
            }
            studentData.studentNum = info.length + 1;

            dataCollection.students.push(studentData);
            //resolve(studentData.studentNum);
            resolve();
        }
        catch(err){
            reject("Unknown Error Occured - Unable to Add New Student: " + err);
        }
    });
}

module.exports.updateStudent = function(studentData){
    return new Promise(function(resolve,reject){
        try{
            let info = dataCollection.students;
            let found = false;
            let updateId;

            for(let i = 0;i<info.length;++i){
                if(info[i].studentNum == studentData.studentNum){
                    updateId = i;
                    found = true;
                    break;
                }
            }
            if(found){
                if(studentData.TA == undefined){
                    studentData.TA = false;
                }else{
                    studentData.TA = true;
                }
                
                //studentData.studentNum = info.length + 1;
    
                dataCollection.students[updateId] = studentData;
                resolve(studentData);
                //resolve(dataCollection.students[updateId]);
            }else{
                reject("No Student Found with That Number:" + studentData.studentNum);
            }
        }
        catch(err){
            reject("Unknown Error Occured - Unable to Add New Student: " + err);
        }
    });
}
