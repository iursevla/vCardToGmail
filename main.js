
let fs = require('fs');

class vCardReader {

    constructor() {
        this.contacts = []; //[{firstName: string, lastName: string, phoneNumber: number}]
        this.vCardPath = './vCards/';//Path with all vcards
    }

    /**
     * Read all files
     *    //For each file:
     *       //Take first name, last Name(if any) and phone number and store them in contacts variable
     *    //Write each contact into a CSV File.
     * @param {number} mobileStart - First number for mobile Phones 
     * @param {number} mainStart - First number for "house" phones.
     * 
     * @memberOf vCardReader
     */
    readAllFiles(mobileStart, mainStart) {
        try {
            let files = fs.readdirSync(this.vCardPath);

            for (let [i, file] of files.entries()) {
                let lines = fs.readFileSync(this.vCardPath + file).toString().match(/^.+$/gm); // https://www.quora.com/What-is-the-best-way-to-read-a-file-line-by-line-in-node-js
                // console.log(lines)
                for (let line of lines) {
                    if (line.includes('=20') || line.includes(";;;")) { // Take first and last name(if any)
                        line = line.replace(/ /g, '');//Remove white spaces
                        line = line.replace(/=20/g, " ").replace(';;;', '').replace(/=C3=A3/g, "a").replace(/=C3=A9/g, "e").replace(/=C3=B3/g, "e").replace(/=C3=AD/g, "i").replace(/=C3=A8/g, "e"); //Remove acentos and =20( replace by spaces) and ;;;
                        this.contacts[i] = { name: line, cell: 0 }
                    }
                    if (line.includes("CELL:")) { // Get cellphone number 
                        line = line.substring(line.indexOf(":") + 1, line.length); //http://stackoverflow.com/a/16470330
                        this.contacts[i].cell = line;
                    }
                }
            }
        } catch (e) {
            console.log('Error:', e.stack);
        }
    }

    listContacts() {
        for (let c of this.contacts)
            console.log(c);
    }

    /**
     * Example OutPut File:
     * Header-> Name,Given Name,Additional Name,Family Name,Yomi Name,Given Name Yomi,Additional Name Yomi,Family Name Yomi,Name Prefix,Name Suffix,Initials,Nickname,Short Name,Maiden Name,Birthday,Gender,Location,Billing Information,Directory Server,Mileage,Occupation,Hobby,Sensitivity,Priority,Subject,Notes,Group Membership,E-mail 1 - Type,E-mail 1 - Value,Phone 1 - Type,Phone 1 - Value,Phone 2 - Type,Phone 2 - Value,Website 1 - Type,Website 1 - Value
     * Iur Sevla,Sevla,,Iur,,,,,,,,,,,,,,,,,,,,,,,* My Contacts,,,Mobile,97 ::: 20,,,,
     * 
     * @param {any} googleCSVFile 
     * @see https://www.faithinmarketing.com/2013/11/google-gmail-contacts-databases-template-headers/
     * @memberOf vCardReader
     */
    writeToTile(googleCSVFile) {

    }
}

let vReader = new vCardReader();
vReader.readAllFiles(9, 2);
vReader.listContacts();