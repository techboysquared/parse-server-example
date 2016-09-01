
    $(document).on('click','#SaveButton',function(e){
       saveData();
    });

function saveData(){
   window.gameSummary.set("notes", $("#notes").val());
        var reviewed = false;
        if($('#reviewed').is(":checked"))
        {
          reviewed = true;
        }
        window.gameSummary.set("reviewed", reviewed);
        window.gameSummary.save();
}

     var currentTile = 1;
     var GameMove = Parse.Object.extend("GameMove");
     var Game =  Parse.Object.extend("Game");
      //var GameMoves =  Parse.Collection.extend({ model: GameMove});
      var GameMoves = Parse.Object.extend(GameMove);
      var gameMoves = new GameMoves();

      var GameMovesView =  Backbone.View.extend({
          template: Handlebars.compile($('#move-table-row-tpl').html()),
          render: function(){ 
           
              var collection = { gameMove: this.collection };
            
              this.$el.html(this.template(collection));
          }
      });

      var GameSummaryView = Backbone.View.extend({
          template: Handlebars.compile($('#game-summary-row-tpl').html()),
          render: function(){
            
            var game =  this.collection.toJSON();

            
            this.$el.html(this.template(game));
          }
      });


      var GameMapView = Backbone.View.extend({
          template: Handlebars.compile($('#map-tpl').html()),
          render: function(){
            var mapTiles = { mapTile : this.collection };
            
            this.$el.html(this.template(mapTiles));
          }
      });
      var ButtonsView = Backbone.View.extend({
          template: Handlebars.compile($('#button-press-row-tpl').html()),
          render: function(){
            
            this.$el.html(this.template(this.collection));
          }
      });


      var SummaryView = Backbone.View.extend({
          template: Handlebars.compile($('#summary-tpl').html()),
          render: function(){
            
            //this.collection.T4 = GetNumberTacticFourAnalysisForGame(this.collection);
            this.collection.T5 = 5;
            var game =  this.collection.toJSON();
            game.T1 = GetNumberTacticOneAnalysisForGame(this.collection);
            game.T2 = GetNumberTacticTwoAnalysisForGame(this.collection);
            game.T3 = GetNumberTacticThreeAnalysisForGame(this.collection);
            game.T4 = GetNumberTacticFourAnalysisForGame(this.collection);
            game.T5 = GetNumberTacticFiveAnalysisForGame(this.collection);
            game.T6 = runTacticSixAnalysisOnGame(this.collection);
            game.T7 = GetNumberTacticSevenAnalysisForGame(this.collection);
            this.$el.html(this.template(game));
          }
      });


      var ReplayView = Backbone.View.extend({
          template: Handlebars.compile($('#replay-tpl').html()),
          render: function(){
            var T1 = trackTray[0];
            var T2 =  trackTray[1];
            var T3 = trackTray[2];


          
            var move = {
               current: currentTile,
               total: gameMoves.length,
               T1: T1,
               T2: T2,
               T3: T3,
               played: gameMoves[currentTile - 1].get("Tile")
            }

            this.$el.html(this.template(move));
          }
      });
      function createMap(stopAt)
      {
          var map = new Array(8);
          for(var i = 0; i < 8; i++)
          {
            map[i] = [{ move: 0, tile: 0}, { move: 0, tile: 0}, { move: 0, tile: 0}, { move: 0, tile: 0}, 
            { move: 0, tile: 0}, { move: 0, tile: 0}, { move: 0, tile: 0}, { move: 0, tile: 0}];
          }
          newMoves = window.gameMoves.slice(0, stopAt)
          for(var i = 0; i < newMoves.length; i++)
          {
           
           var x = newMoves[i].attributes.XPos;
            var y = newMoves[i].attributes.YPos;
            var tile = newMoves[i].attributes.Tile;
            map[y][x].tile = tile;
            map[y][x].move = i + 1;
          }
          map[5][7].tile = 10;
          var gameMapView = new GameMapView({ collection: map });
          gameMapView.render();
          $('#gameMap').html(gameMapView.el);

      }

      gameMoves.fetch(
        {
          success: function(gameMoves)
          {
            /*var movesView = new GameMovesView({ collection: gameMoves });
           // console.log(gameMoves);
            movesView.render();
            $('#table').html(movesView.el);*/
          },
          error: function(gameMoves, error) {
              console.log(error);
          }
        });

      var query = new Parse.Query('Game');
      query.include('GameMoves');
      query.include('GameMove');
      query.include('GameMoves.GameMove');
      query.include('GeneratedTracks');
      query.include('ButtonPresses');
      var gameId = window.sessionStorage.getItem('game_id');
      console.log(gameId);
      query.get(gameId, {
        success: function(gameSummary) {
          window.gameSummary = gameSummary;
          var gameView = new GameSummaryView({ collection: gameSummary });
          gameView.render();
          $('#gameSummary').html(gameView.el);
          var gMoves = gameSummary.get("GameMoves");
          window.gameMoves = gameSummary.get("GameMoves");
          window.generatedTracks = gameSummary.get("GeneratedTracks");
          if(generatedTracks === undefined)
          {
            generatedTracks = [];
          }
          var buttonPresses = gameSummary.get("ButtonPresses");
          window.trackTray = [generatedTracks[0], generatedTracks[1], generatedTracks[2]];
          window.generatedTrackIndex = 2;
          createMap(gMoves.length);

           var movesView = new GameMovesView({ collection: gMoves });
            movesView.render();
            $('#table').html(movesView.el);
            var summaryView = new SummaryView({collection:gameSummary });
            summaryView.render();
            $("#summary").html(summaryView.el);
            var replayView = new ReplayView({ collection:gMoves });
            replayView.render();
            $("#replay").html(replayView.el);

            var buttonView = new ButtonsView({ collection: buttonPresses });
            buttonView.render();
            $("#buttons").html(buttonView.el);
            
        },

        error: function(object, error) {
          // error is an instance of Parse.Error.
        }
    });
Handlebars.registerHelper("convertTime", function(seconds) {

  var mins = Math.floor(seconds / 60);
  var seconds = seconds % 60;
  if(seconds < 10)
  {
    seconds = "0" + seconds;
  }
  return mins + ":" +seconds ;
});

function canTypeInBox(){
  return !$("#notes").is(":focus");
}
$(document).keypress(function(e) {
    if(canTypeInBox())
    {
      if(e.which == 110 && currentTile < gameMoves.length) {
          currentTile++;
          
          if(currentTile > 2)
          {
            for(var i = 0; i < trackTray.length; i++)
            {
                if(trackTray[i] == gameMoves[currentTile - 2].get("Tile"))
                {
                    
                    ++generatedTrackIndex
                  
                    trackTray[i] = generatedTracks[generatedTrackIndex];
                    break;
                }
            }
          }
          var replayView = new ReplayView({collection: window.gameMoves });
          replayView.render();
          $("#replay").html(replayView.el);
          createMap(currentTile);
      }
      else if(e.which == 108){
          if(currentTile > 1)
          {
              currentTile--;
              if(currentTile > 2)
              {
                for(var i = 0; i < trackTray.length; i++)
                {
                    if(trackTray[i] == generatedTracks[generatedTrackIndex])
                    {
                        --generatedTrackIndex
                      
                        trackTray[i] = generatedTracks[generatedTrackIndex];
                        break;
                    }
                }
              }
              var replayView = new ReplayView({collection: window.gameMoves });
              replayView.render();
              $("#replay").html(replayView.el);

          }
          createMap(currentTile);
      }
      else if(e.which == 98)
      {
        history.go(-1);
      }
      else if(e.which == 114)
      {
        
        $('#reviewed').click(); 
      }
      else if(e.which == 49)
      {
        $("#gameTab").click();
      }
      else if(e.which == 50)
      {
        $("#sumTab").click();
      }
      else if(e.which == 51)
      {
        $("#replayTab").click();
      }
      else if(e.which == 52)
      {
        $("#buttonsTab").click();
      }
      
      
      
    
  }
   
    
});


document.addEventListener("keydown", function(e) {
  if (e.keyCode == 83 && (navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey)) {
    e.preventDefault();
    saveData();
  }
}, false);

