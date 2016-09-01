
function setupHeaders(csv)
{
	csv.next_column("Study Sequence #");
	csv.next_column("Study ID #");
	csv.next_column("Control 5 Major(s) in college");
	csv.next_column("Group # No Breaks (1) Breaks (2)");
	csv.next_column("Total Time in Play");
	csv.next_column("Total Time in Break");
	csv.next_column("Longest Break Time");
	csv.next_column("Modal Break Time");
	csv.next_column("StDev Break Time");
	csv.next_column("Modal + StDev Break Time M1D");
	csv.next_column("Modal +  2x StDev Break Time M2D");
	csv.next_column("# Breaks GTE M1D");
	csv.next_column("# Breake GTE M2D");
	csv.next_column("# Trip Attempts");
	csv.next_column("# Completions");
	csv.next_column("% Completions");
	csv.next_column("Frontier Score");
	csv.next_column("Frontier Score Trip#");
	csv.next_column("# Tactics Demonstrated");
	csv.next_column("Tactic 1 Speed 1st Trip #");
	csv.next_column("Tactic 2 Erase 1st Trip #");
	csv.next_column("Tactic 3 Discard 1st Trip #");
	csv.next_column("Tactic 4 Loop 1st Trip #");
	csv.next_column("Tactic 5 GT 16 1st Trip #");
	csv.next_column("Tactic 6 Play Ahead 1st Trip #");
	csv.next_column("Tactic 7 Closed Loop 1st Trip #");
	csv.next_column("Control 1 Wonderlic Score");
	csv.next_column("Control 2 Mini-IPAP Score");
	csv.next_column("Control 3 Video Game Experience");
	csv.next_column("Control 4 Gender");
	csv.next_column("Control 5 Year in College");
	csv.end_row();
}

function getRounds( session_num, csv){
	if(session_num >= sessions.length)
	{
		downloadCSV(csv.value, csv.name);
		return;
	}
	var val = session_num / (sessions.length * 1.0) * 100;
	$("#progress-bar").css("width", String(val) + "%");
	$("#progress-bar").attr("aria-valuenow", String(val) + "%");

	console.log("sesh num" + session_num)
	//console.log(sessions[session_num])
	console.log("HERE")
	query.get(sessions[session_num].id, {
        success: function(sessionSummary) {

          var query = new Parse.Query('Round');
          query.include('GamesPlayed');
          query.include('GamesPlayed.GameMoves')
          query.equalTo("SessionOwner", sessionSummary);
          query.find({
            success: function(results) {
              window.Rounds = results;
              exportSession(session_num, csv);
              
            },
            error: function(error) {
              alert("Error: " + error.code + " " + error.message);
            }
          });         
         
        },

        error: function(object, error) {
          // error is an instance of Parse.Error.
        }
    });
}
function findModeArray(array)
{
	var frequency = {};  // array of frequency.
	var max = 0;  // holds the max frequency.
	var result;   // holds the max frequency element.
	for(var v in array) {
	        frequency[array[v]]=(frequency[array[v]] || 0)+1; // increment frequency.
	        if(frequency[array[v]] > max) { // is this frequency > max so far ?
	                max = frequency[array[v]];  // update max.
	                result = array[v];          // update result.
	        }
	}
	return result;
}

function exportBreakData(csv){
	
	var trip_num = 1;
	var timePlay = 0;
	var timeBreak = 0;
	var longest_break = 0;
	var breaks = [];
	for(var i = 0; i < Rounds.length; i++)
	{
		var games = Rounds[i].get("GamesPlayed")
		for(var gi = 0; gi < games.length; gi++)
		{
			var startTime = games[gi].get("StartTime");
			var endTime = games[gi].get("EndTime");
			var totalTime = 0;
			var breakTime = 0;
			if( startTime !== undefined && endTime != undefined)
			{
				totalTime = (endTime -startTime)
				timePlay += totalTime;
			}
			if(gi > 0)
			{
				lastTripEnd = games[gi - 1].get("EndTime");
				if(lastTripEnd !== undefined && startTime !== undefined)
				{
					breakTime = startTime - lastTripEnd;
					timeBreak += breakTime;
					if(breakTime > longest_break)
					{
						longest_break = breakTime;
					}
					breaks.push(breakTime);
				}
			}
			trip_num++;
		}
	}
	//var mode = findModeArray(breaks);
	var mode = breaks.length != 0 ? parseInt(math.mode(breaks)) : 0;
	var stdDev = breaks.length != 0 ? parseFloat(math.std(breaks)) : 0;
	var m1 = mode + stdDev;
	var m2 = mode + (stdDev * 2);

	//computate GTE modal time stdev1stdev2
	var breaksGTEM1D = 0;
	var breaksGTEM2D = 0;
	for(var i = 0; i < breaks.length; i++)
	{
		if(breaks[i] >= m1)
		{
			++breaksGTEM1D;
		}
		if(breaks[i] >= m2)
		{
			++breaksGTEM2D;
		}
	}

	
	csv.next_column(timePlay) // Total Time in Play
	csv.next_column(timeBreak) // Total Time in Break
	csv.next_column(longest_break) // Longest Break Time
	csv.next_column(mode) // modal break time
	csv.next_column(stdDev) 
	csv.next_column(m1) // modal stdDev 1
	csv.next_column(m2) // modal stdDev 2
	csv.next_column(breaksGTEM1D);
	csv.next_column(breaksGTEM2D);


}
function exportScoringData(csv)
{
	var trip_num = 1;
	var completions = 0; 
	var highScore = 0;
	var highScoreTripNum = 0;
	for(var i = 0; i < Rounds.length; i++)
	{
		var games = Rounds[i].get("GamesPlayed")
		for(var gi = 0; gi < games.length; gi++)
		{
			
			if(games[gi].get("TripComplete"))
			{
				completions++;
			}
			if(games[gi].get("PointsScored") > highScore)
			{
				highScore = games[gi].get("PointsScored");
				highScoreTripNum = trip_num;
			}
			trip_num++;
		}
	}
	csv.next_column(trip_num) // trips attempted
	csv.next_column(completions) // completions
	csv.next_column(completions / (trip_num * 1.0) * 100)// % completed
	csv.next_column(highScore) // frontier score
	csv.next_column(highScoreTripNum) // frontier score trip #

}
function exportTacticData(csv)
{
	var trip_num = 1;
	var t1 = 0;
	var t2 = 0;
	var t3 = 0;
	var t4 = 0;
	var t5 = 0;
	var t6 = 0;
	var t7 = 0;
	var tactics = 0;
	for(var i = 0; i < Rounds.length; i++)
	{
		var games = Rounds[i].get("GamesPlayed")
		for(var gi = 0; gi < games.length; gi++)
		{
			if(t1 == 0)
			{
				var tactic = runTacticOneAnalysisOnGame(games[gi]);
				if(tactic)
				{
					t1 = trip_num;
					tactics++;
				}
			}
			if(t2 == 0)
			{
				var tactic = runTacticTwoAnalysisOnGame(games[gi]);
				if(tactic)
				{
					t2 = trip_num;
					tactics++;
				}
			}
			if(t3 == 0)
			{
				var tactic = runTacticThreeAnalysisOnGame(games[gi]);
				if(tactic)
				{
					t3 = trip_num;
					tactics++;
				}
			}
			
			if(t4 == 0)
			{
				var tactic = runTacticFourAnalysisOnGame(games[gi]);
				if(tactic)
				{
					t4 = trip_num;
					tactics++;
				}
			}
			if(t5 == 0)
			{
				var tactic = runTacticFiveAnalysisOnGame(games[gi])
				if(tactic)
				{
					t5 = trip_num;
					tactics++;
				}
			}
			if(t6 == 0)
			{
				var tactic = runTacticSixAnalysisOnGame(games[gi])
				if(tactic)
				{
					t6 = trip_num;
					tactics++;
				}
			}
			if(t7 == 0)
			{
				var tactic = runTacticSevenAnalysisOnGame(games[gi])
				if(tactic)
				{
					t7 = trip_num;
					tactics++;
				}
			}
			trip_num++;
			// TODO: add tactic 6 and tactic 7
		}
	}
	csv.next_column(tactics) // #tactics demonstrated
	csv.next_column(t1) // 1st t1
	csv.next_column(t2) // 1st t2
	csv.next_column(t3) // 1st t3
	csv.next_column(t4) // 1st t4
	csv.next_column(t5) // 1st t5
	csv.next_column(t6) // 1st t6
	csv.next_column(t7) // 1st t7
}
function exportSession(session, csv)
{
	
	if(session >= window.sessions.length)
	{
		downloadCSV(csv.value, csv.name);
	}
	csv.next_column("");
	csv.next_column(sessions[session].get("Token"));
	csv.next_column("") // majors in college

	var token = sessions[session].get("Token");
	var group = "";
	for(var i = token.length - 1; i >= 0; i--)
	{
		if(token[i] == "G" || token[i] == "g")
	    {
	      console.log("Found a G");
	  	  if(i + 1 < token.length)
	      {
	  		  group = token[i+1]
	          break;
	      }
	    }
	}

	csv.next_column(group) // Group #
	exportBreakData(csv);
	exportScoringData(csv);
	exportTacticData(csv);
	csv.end_row();
	setTimeout(getRounds(session +1, csv), 1000);
}

function exportAllData()
{
	csv = new csvOBJ(Date.now() + "-betweenstudies.csv");
	setupHeaders(csv);
	getRounds(118, csv);

}


$("#export").click(
	function()
	{
		$("#progress-bar").css("width", "0%");
        $("#progress-bar").attr("aria-valuenow", "0%");
		exportAllData();
	});
