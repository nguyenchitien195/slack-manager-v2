class Helper{

    static convertDate(unixtimestamp){
        // Months array
        var months_arr = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
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
        // Display date time in MM-dd-yyyy h:m:s format
        var convdataTime = day + '-' + month + '-' + year;
        return convdataTime;
    }

    static desc(a, b, orderBy) {
        if (b[orderBy] < a[orderBy]) {
          return -1;
        }
        if (b[orderBy] > a[orderBy]) {
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
    
    static getSorting(order, orderBy) {
        return order === 'desc' ? (a, b) => this.desc(a, b, orderBy) : (a, b) => -(this.desc(a, b, orderBy));
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

}

export default Helper;