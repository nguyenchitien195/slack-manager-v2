class Helper{
    static getFileTypes(){
        return [
            {id: 'jpg', name: 'jpg'},
            {id: 'png', name: 'png'},
            {id: 'gif', name: 'gif'},
            {id: 'zip', name: 'zip'},
            {id: 'text', name: 'text'},
            {id: 'doc', name: 'doc'},
            {id: 'docx', name: 'docx'},
            {id: 'pdf', name: 'pdf'},
            {id: 'mp4', name: 'mp4'}
        ];
    }

    static convertDate(unixtimestamp){
        // Months array
        const months_arr = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        // Convert timestamp to milliseconds
        var date = new Date(unixtimestamp*1000);
        // Year
        var year = date.getFullYear();
        // Month
        // var month = months_arr[date.getMonth()];
        var month = date.getMonth() + 1;
        // Day
        var day = date.getDate();
        // Hours
        var hours = date.getHours();
        // Minutes
        var minutes = "0" + date.getMinutes();
        // Seconds
        var seconds = "0" + date.getSeconds();
        // Display date time in dd-MM-yyyy format
        return day + '-' + month + '-' + year;
    }

    static toSizeString(byte) {
        if (byte < Math.pow(2, 10)) {
            return byte + ' B';
        } else if (byte < Math.pow(2, 20)) {
            return (byte / Math.pow(2, 10)).toFixed(0) + ' kB';
        } else if (byte < Math.pow(2, 30)) {
            return (byte / Math.pow(2, 20)).toFixed(2) + ' MB';
        } else if (byte < Math.pow(2, 40)) {
            return (byte / Math.pow(2, 30)).toFixed(2) + ' GB';
        }
    }

    // Sorting
    static desc(a, b, field) {
        let valA = a[field];
        let valB = b[field];
        let tempArray = field.split('.');
        if (tempArray.length === 2) {
            valA = a[tempArray[0]][tempArray[1]];
            valB = b[tempArray[0]][tempArray[1]];
        }
        if (valB < valA) {
            return -1;
        }
        if (valB > valA) {
            return 1;
        }
        return 0;
      }
      
    static stableSort(array, cmp) {
        const stabilizedThis = array.map((el, index) => [el, index]);
        stabilizedThis.sort((a, b) => {
            const order = cmp(a[0], b[0]);
            if (order !== 0) return order;
            return a[1] - b[1];
        });
        return stabilizedThis.map(el => el[0]);
    }
    
    static getSorting(order, field) {
        return order == 'DESC' ? (a, b) => this.desc(a, b, field) : (a, b) => -(this.desc(a, b, field));
    }
    // End of sorting

}

export default Helper;