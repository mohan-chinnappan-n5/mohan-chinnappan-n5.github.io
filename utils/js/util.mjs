// import process from 'process';

// mchinnappan


export class Util {
  constructor() {}

  getEle(id) {
    return document.getElementById(id);
  }

  async getDataCenter(instances) {
    let result = [];
    const url = 'https://raw.githubusercontent.com/mohan-chinnappan-n/cli-dx/master/instances/sf-managed.csv';
    const instanceData = await this.fetchUrlText(url);
    const results = Papa.parse(instanceData, {
      header: true, // Treat the first row as a header row
      skipEmptyLines: true, // Skip empty lines
      dynamicTyping: true, // Automatically convert numeric and boolean values
      delimiter: ',', // Set the delimiter character
      quoteChar: '"' // Set the quote character
    });

    const instanceList = instances.split(',');
 
    instanceList.forEach(instance => {
    results.data.forEach(row => {
      if (row['SFManagedInstance'] === instance) {
        result.push(row);
      }
     });
    });

     return result;

  }


  async  fetchUrlText(url) {
    const response = await fetch(url);
    const content = await response.text();
    return content;
  }

  getUrlParams() {
    return new URL(document.location).searchParams;
  }

  isBirthDay(dob) {
    const currentDate = new Date();
    const birthDate = new Date(dob);
    if (currentDate.getDate() == birthDate.getDate() + 1) return true;
    else return false;
  }

  doMatch(mathstr) {
    return mathstr;
  }

  getAge(dob) {
    // create a new date object with the birthdate
    const birthDate = new Date(dob);

    // get the current date
    const currentDate = new Date();

    // subtract the birth year from the current year
    let age = currentDate.getFullYear() - birthDate.getFullYear();

    // check if the birth month is later than the current month
    if (currentDate.getMonth() < birthDate.getMonth()) {
      // subtract one year from the age
      age--;
    } else if (currentDate.getMonth() === birthDate.getMonth()) {
      // if the birth month is the current month, check the day
      if (currentDate.getDate() < birthDate.getDate()) {
        // subtract one year from the age if the birth day is later in the month than the current day
        age--;
      }
    }
    return age;

    // the 'age' variable now contains the person's age
  }
}

// const util = new Util();
// console.log(util.getAge(process.argv[2]));
// console.log(process.argv);
