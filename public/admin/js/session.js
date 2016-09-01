
      var SessionView =  Backbone.View.extend({
          template: Handlebars.compile($('#session-table-row-tpl').html()),
          render: function(){ 
              
              var collection = { Rounds: this.collection};
             
              GraphRounds(this.collection);
              GraphTripScore(this.collection);
             GraphPlacementData(this.collection);
              this.$el.html(this.template(collection));
          }
      });


      function GraphTripScore(Rounds)
      {
        var TripScores =  ['Trip Scores', 0];
         
      var parseIds = [''];
         
       var completes = [];
       

          for(var index = 0; index < Rounds.length; index++)
        {

          var GamesPlayed = Rounds[index].get("GamesPlayed");
          
          for(var i = 0; i < GamesPlayed.length; i++ )
              {
                var PointsScored = GamesPlayed[i].get("PointsScored");
                if(PointsScored !== undefined)
                {
                 
                  TripScores.push(PointsScored);
                  parseIds.push(GamesPlayed[i].id);
                  completes.push(GamesPlayed[i].get("TripComplete"));
                }
                else
                {
                  TripScores.push(0)
                  parseIds.push(GamesPlayed[i].id);
                  completes.push(false);
                }
                
              }
          }
              
             
        var chart = c3.generate({
            bindto: '#tripchart',
            size: {
  height: 600
},
       data: {
         onclick: function (d, element) { loadGame(parseIds[d.index]); },
        columns: 
        [TripScores]
        ,
        color: {
        },
            type: 'area'
      },
      regions:graphRegions(Rounds)
    });

      }

      function GraphPlacementData(Rounds)
      {
          var TilesPlaced = ['Tiles Placed'];
          var TilesInline = ['Tiles Inline'];
        
        var CumalitiveTilesPlaced = 0;
        var CumalitiveTilesInline = 0;
        var InlinePercentages = ['Inline Percentage', 0];
        var parseIds = [''];
        
    
        for(var index = 0; index < Rounds.length; index++)
        {

          var GamesPlayed = Rounds[index].get("GamesPlayed");
          
          for(var i = 0; i < GamesPlayed.length; i++ )
              {

                 var placed  = GamesPlayed[i].get("TilesPlaced");
                var inline = GamesPlayed[i].get("TilesInline");
                if(placed !== undefined && inline !== undefined)
                {
                  CumalitiveTilesPlaced += placed;
                 // TilesPlaced.push(CumalitiveTilesPlaced);
                  CumalitiveTilesInline += inline;
                //  TilesInline.push(CumalitiveTilesInline);
                InlinePercentages.push((CumalitiveTilesInline / CumalitiveTilesPlaced) * 100);
                parseIds.push(GamesPlayed[i].id);
                }
                else
                {
                  InlinePercentages.push((CumalitiveTilesInline / CumalitiveTilesPlaced) * 100);
                  parseIds.push(GamesPlayed[i].id);
                }
                
              }
          }
              
                   
        var chart = c3.generate({
            bindto: '#tile-chart',
       data: {
        onclick: function (d, element) { loadGame(parseIds[d.index]); },
        columns: 
        [InlinePercentages]
        ,
            type: 'area'
      }, 
       regions: graphRegions(Rounds),
        size: {
  height: 600
},

    });
      }
    




      function graphRegions(Rounds)
      {
        var regions = [];
        var lastEnd = 0;
        for(var i = 0; i < Rounds.length; i++)
        {
          GamesPlayed = Rounds[i].get("GamesPlayed");
          var end = lastEnd + GamesPlayed.length -1;
          
          regions.push({ start: lastEnd, end: end, class: (i % 2 == 0) ? 'round-one-graph' : 'round-two-graph' });
          lastEnd = end;

        }
        
        return regions;
      }

      function GraphRounds(Rounds)
      {
        var CumalitiveScores = ['CumalitiveScores', 0];
       
        var CumalitiveScore = 0;
        var parseIds = [''];
        var completes = [];
        for(var index = 0; index < Rounds.length; index++)
        {

          var GamesPlayed = Rounds[index].get("GamesPlayed");
         
          for(var i = 0; i < GamesPlayed.length; i++ )
              {
                var PointsScored = GamesPlayed[i].get("PointsScored");
                if(PointsScored !== undefined)
                {
                 CumalitiveScore += PointsScored;
                  CumalitiveScores.push(CumalitiveScore);
                  parseIds.push(GamesPlayed[i].id);
                  completes.push(GamesPlayed[i].get("TripComplete"));
                }
                else
                {

                  CumalitiveScores.push(CumalitiveScore);
                  parseIds.push(GamesPlayed[i].id);
                  completes.push(false);
                }
                
              }
          }
              var endRoundOne = 5;
              var endRoundTwo = 7;
        
        var chart = c3.generate({
            bindto: '#chart',
       data: {


      
                    onclick: function (d, element) { loadGame(parseIds[d.index]); },
               
        columns: 
        [CumalitiveScores]
        ,
          type: 'area'
          
           
      },
      size: {
  height: 600
},
      regions: 
            graphRegions(Rounds)
        
    });
      }
          
      

      var session = window.sessionStorage.getItem("session_id");

      
     
      var query = new Parse.Query('Session');
 
      query.include('Rounds');
      query.include('Rounds.GamesPlayed');
      query.include('Rounds.GamesPlayed.GameMoves')
      query.include('Rounds.GamesPlayed.GameMoves.GameMove')
      query.include('GameMove')
     
    
      query.get(session, {
        success: function(sessionSummary) {
          window.Session = sessionSummary;
          var query = new Parse.Query('Round');
          query.include('GamesPlayed');
          query.include('GamesPlayed.GameMoves')
          query.equalTo("SessionOwner", sessionSummary);
          query.find({
            success: function(results) {
              window.Rounds = results;
              var sessionView= new SessionView({ collection: results });
              sessionView.render();
              $('#sessionSummary').html(sessionView.el);  
              
            },
            error: function(error) {
              alert("Error: " + error.code + " " + error.message);
            }
          });         
         
        },

        error: function(object, error) {
          console.log(error);
          // error is an instance of Parse.Error.
        }
    });
    $(document).on('click', '.round-row', function()
      {
        var roundId = $(this).find('.round-id').attr('value');
        loadRound(roundId);

      });  

    $("#exportButton").click(
      function()
      {
        
        exportFile(Session.get("Token") + ".csv");
      });
    $("#analysisButton").click(
      function()
      {
        
        tacticAnalysis(window.Rounds);
        
      });

    function loadRound(roundId)
    {
       window.sessionStorage.setItem('round_id', roundId);
        window.location.href="round.html";
    }
    function loadGame(gameId)
    {
      window.sessionStorage.setItem('game_id', gameId);
        window.location.href="game.html";
    }
    function setupWithinStudiesHeaders(csv)
    {
      csv.next_column("Trip #");
      csv.next_column("Start Time");
      csv.next_column("Stop Time");
      csv.next_column("Trip Duration");
      csv.next_column("Preceding Break Time (BT)");
      csv.next_column("Preceding BT is GTE M1D");
      csv.next_column("Preceding BT is GTE M2D");
      csv.next_column("Trip Complete-0 or 1");
      csv.next_column("Trip Score");
      csv.next_column("Total Score");
      csv.next_column("New Frontier Score 0 is N and 1 is Y");
      csv.next_column("Inline Tile Count");
      csv.next_column("Outline Tile Count");
      csv.next_column("Tactic 1 Speed Observered-0 or 1");
      csv.next_column("Tactic 1 Speed # Observed");
      csv.next_column("Tactic 2 Erase Observed-0 or 1");
      csv.next_column("Tactic 2 Erase # Observed");
      csv.next_column("Tactic 3 Discard Observed-0 or 1");
      csv.next_column("Tactic 3 Discard # Observed");
      csv.next_column("Tactic 4 Loop Observed-0 or 1");
      csv.next_column("Tactic 4 Loop #Observed");
      csv.next_column("Tactic 5 Extend(16) Observed-0 or 1");
      csv.next_column("Tactic 5 Extend #Observed");
      csv.next_column("Tactic 6 Play Ahead Observed-0 or 1");
      csv.next_column("Tactic 7 Closed Loop Observed-0 or 1");
      csv.next_column("Tactic 7 Closed Loop #Observed");
      csv.end_row();
    }
    
    function analyzeSession( csv)
    {
      var totalTrip = 1;
      var highScore = 0;
      var totalScore = 0;
      var breaks = [];
      for(var i = 0; i < Rounds.length; i++)
      {
        games = Rounds[i].get("GamesPlayed");
        
        for(var trip = 0; trip < games.length; trip++)
        {
            var startTime = games[trip].get("StartTime");
            var endTime = games[trip].get("EndTime");
            var breakTime = 0;

            if(trip > 0)
            {
              var lastTripEnd = games[trip - 1].get("EndTime");
              if(lastTripEnd !== undefined && startTime !== undefined)
              {
                breakTime = startTime - lastTripEnd;
                breaks.push(breakTime);
              }
            }
        }
        
      }
      var mode = breaks.length != 0 ? parseInt(math.mode(breaks)) : 0;
      var stdDev = breaks.length != 0 ? parseFloat(math.std(breaks)) : 0;
      var m1 = mode + stdDev;
      var m2 = mode + (stdDev * 2);
      for(var i = 0; i < Rounds.length; i++)
      {
        games = Rounds[i].get("GamesPlayed");
        
        for(var trip = 0; trip < games.length; trip++, totalTrip++)
        {
          
          var tripStart = games[trip].get("StartTime");
          var tripEnd = games[trip].get("EndTime");
          var tripDuration = tripEnd - tripStart;
          var breakBefore = 0;
          var PointsScored = games[trip].get("PointsScored");
          
          var isFrontierScore = 0;
          var TilesInline = getTilesInline(games[trip].get("GameMoves")); 
          var TilesOutline =  getTilesOutline(games[trip].get("GameMoves")); 

          var T1Observed = runTacticOneAnalysisOnGame(games[trip]) ? 1 : 0;
          var T1Number = GetNumberTacticOneAnalysisForGame(games[trip]);
          var T2Observed = runTacticTwoAnalysisOnGame(games[trip]) ? 1 : 0;
          var T2Number = GetNumberTacticTwoAnalysisForGame(games[trip]);
          var T3Observed = runTacticThreeAnalysisOnGame(games[trip]) ? 1 : 0;
          var T3Number = GetNumberTacticThreeAnalysisForGame(games[trip]);
          var T4Observed = runTacticFourAnalysisOnGame(games[trip]) ? 1 : 0;
          var T4Number = GetNumberTacticFourAnalysisForGame(games[trip]);
          var T5Observed = runTacticFiveAnalysisOnGame(games[trip]) ? 1 : 0;
          var T5Number = GetNumberTacticFiveAnalysisForGame(games[trip]);
          
           console.log("-- TRIP: " + totalTrip)
          var T6Observed = runTacticSixAnalysisOnGame(games[trip]) ? 1 : 0;
          var T7Observed =  runTacticSevenAnalysisOnGame(games[trip]) ? 1 : 0;
          var T7Number = GetNumberTacticSevenAnalysisForGame(games[trip]);
   


          if(PointsScored === undefined)
          {
            PointsScored = 0;
          }
          totalScore += PointsScored;
          if(PointsScored > highScore)
          {
            highScore = PointsScored;
            isFrontierScore = 1;
          }
          if(trip > 0)
          {
            breakBefore = games[trip].get("StartTime") - games[trip - 1].get("EndTime");
          }

          csv.next_column(totalTrip);
          csv.next_column(tripStart);
          csv.next_column(tripEnd);
          csv.next_column(tripDuration);
          csv.next_column(breakBefore);
          csv.next_column(breakBefore > m1 ? 1 : 0);
          csv.next_column(breakBefore > m2 ? 1 : 0); 
          csv.next_column(games[trip].get("TripComplete") ? "1":"0");
          csv.next_column(PointsScored); 
          csv.next_column(totalScore); 
          csv.next_column(isFrontierScore); 
          csv.next_column(TilesInline);
          csv.next_column(TilesOutline);
          csv.next_column(T1Observed);
          csv.next_column(T1Number);
          csv.next_column(T2Observed);
          csv.next_column(T2Number);
          csv.next_column(T3Observed);
          csv.next_column(T3Number);
          csv.next_column(T4Observed);
          csv.next_column(T4Number);
          csv.next_column(T5Observed);
          csv.next_column(T5Number);
          csv.next_column(T6Observed);
          csv.next_column(T7Observed);
          csv.next_column(T7Number);
          csv.end_row();
            
        }
        
      }
    }
    function exportFile(filename)
    {
      csv = new csvOBJ(filename);
      setupWithinStudiesHeaders(csv);
      
      analyzeSession(csv);
      
      downloadCSV(csv.value, csv.name);
    }