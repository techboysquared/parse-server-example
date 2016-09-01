function downloadCSV(csv, name)
    {
        var filename = name;

        if (!csv.match(/^data:text\/csv/i)) {
            csv = 'data:text/csv;charset=utf-8,' + csv;
        }
        data = encodeURI(csv);

        link = document.createElement('a');
        link.setAttribute('href', data);
        link.setAttribute('download', filename);
        link.click();
    }

function csvOBJ(name)
{
    this.name = name;
    this.value = "";
    this.first_column = true;
    this.next_column = function(val)
    {
        if(!this.first_column)
        {
            this.value += ",";
        }
        else
        {
            this.first_column = false;
        }
        this.value += val;
        

    }
    this.end_row = function()
    {
        this.value += "\n";
        this.first_column = true;
    }
}