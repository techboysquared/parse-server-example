
function runTacticOneAnalysisOnGame(game)
{
	return GetNumberTacticOneAnalysisForGame(game) > 0;
}
function GetNumberTacticOneAnalysisForGame(game)
{
	buttonPresses = game.get("ButtonPresses");

	T1 = (buttonPresses != null) ? buttonPresses.length : 1;
	T1--;
	return T1;
}

function runTacticTwoAnalysisOnGame(game)
{
	return GetNumberTacticTwoAnalysisForGame(game) > 0;
}

function GetNumberTacticTwoAnalysisForGame(game)
{
	moves = game.get("GameMoves");
	var bombs = 0;
	for(var i = 0; i < moves.length; i++)
	{
		if(moves[i].get("Tile") == 11)
		{
			bombs++;

		}
	}
	return bombs;
}

function runTacticThreeAnalysisOnGame(game)
{
	return GetNumberTacticThreeAnalysisForGame(game) > 0;
}
function GetNumberTacticThreeAnalysisForGame(game)
{
	moves = game.get("GameMoves");
	var discards = 0;
	
	for(var i = 0; i < moves.length; i++)
	{
		if(moves[i].get("Inline") == false && moves[i].get("Tile") != 11 )
		{
			var isDiscard = true;
			var x = moves[i].get("XPos");
			var y = moves[i].get("YPos");
			var leftTrack = getTrack(x - 1, y, moves);
			var upTrack = getTrack(x, y - 1, moves);
			var rightTrack = getTrack(x + 1, y, moves);
			var downTrack = getTrack(x, y + 1, moves);
			var neTrack = getTrack(x + 1, y - 1, moves);
			var nwTrack = getTrack(x - 1, y - 1, moves);
			var swTrack = getTrack(x - 1, y + 1, moves);
			var seTrack = getTrack(x + 1, y + 1, moves);
			if(neTrack != 0)
			{
				if(neTrack.get("Inline"))
				{
					isDiscard = false;
				}
			}
			if(nwTrack != 0)
			{
				if(nwTrack.get("Inline"))
				{
					isDiscard = false;
				}
			}
			if(swTrack != 0)
			{
				if(swTrack.get("Inline"))
				{
					isDiscard = false;
				}
			}
			if(seTrack != 0)
			{
				if(seTrack.get("Inline"))
				{
					isDiscard = false;
				}
			}
			if(leftTrack != 0)
			{
				if(leftTrack.get("Inline"))
				{

					isDiscard = false;
				}
			}
			if(rightTrack != 0)
			{
				if(rightTrack.get("Inline"))
				{
					isDiscard = false;
				}
			}
			if(upTrack != 0)
			{
				if(upTrack.get("Inline"))
				{
					isDiscard = false;
				}
			}
			if(downTrack != 0)
			{
				if(downTrack.get("Inline"))
				{
					isDiscard = false;
				}
			}

			if(isDiscard)
			{
				discards++;
			}
		}
	}
	game.set('T3', discards);
	return discards;
}

function isContinousLoopPiece(piece)
{
	tile = piece.get("Tile")
	if(tile == 1 || tile == 8 || tile == 9)
	{
		return true;
	}
	return false;
}

function getTrack(x, y, tracks)
{
	if(x < 0 || y < 0 || y > 7 || x > 7)
	{
		return 0;
	}
	for(var i = 0; i < tracks.length; i++)
	{
		track = tracks[i];
		if(track.get("XPos") == x && track.get("YPos") == y)
		{
			return track;
		}
	}
	return 0;
}


function canGoLeft(track)
{
	if(track == 0)
	{
		return false;
	}
	tile = track.get("Tile");
	if(tile == 1 || tile == 3 || tile == 6 || tile == 7 || tile == 8 || tile == 9)
	{
		if(track.get("Inline"))
		{
			return true;
		}
	}
	return false;
}
function canGoRight(track)
{
	if(track == 0)
	{
		return false;
	}
	tile = track.get("Tile");
	if(tile == 1 || tile == 3 || tile == 4 || tile == 5 || tile == 8 || tile == 9)
	{
		if(track.get("Inline"))
		{
			return true;
		}
	}
	return false;
}
function canGoUp(track)
{
	if(track == 0)
	{
		return false;
	}
	tile = track.get("Tile");
	if(tile == 1 || tile == 2 || tile == 4 || tile == 7 || tile == 8 || tile == 9)
	{
		if(track.get("Inline"))
		{
			return true;
		}
	}
	return false;
}
function canGoDown(track)
{
	if(track == 0)
	{
		return false;
	}
	tile = track.get("Tile");
	if(tile == 1 || tile == 2 || tile == 5 || tile == 6 || tile == 8 || tile == 9)
	{
		if(track.get("Inline"))
		{
			return true;
		}
	}
	return false;
}


function runTacticFourAnalysisOnGame(game)
{
	
	return GetNumberTacticFourAnalysisForGame(game) > 0;
}
function GetNumberTacticFourAnalysisForGame(game)
{
	moves = game.get("GameMoves");
	loops = 0;
	for(var i = 0; i < moves.length; i++)
	{
		if(moves[i].get("Inline") && isContinousLoopPiece(moves[i]) )
		{
			
			leftTrack = getTrack(moves[i].get("XPos") - 1, moves[i].get("YPos"), moves);
			rightTrack = getTrack(moves[i].get("XPos") + 1, moves[i].get("YPos"), moves);
			upTrack = getTrack(moves[i].get("XPos"), moves[i].get("YPos") - 1, moves);
			downTrack = getTrack(moves[i].get("XPos"), moves[i].get("YPos") + 1, moves);
			if(canGoLeft(leftTrack) && canGoRight(rightTrack) && canGoUp(upTrack) && canGoDown(downTrack))
			{
				loops++;
			}
		}
	}
	game.set('T4', loops);
	return loops;
}


function runTacticFiveAnalysisOnGame(game)
{
	return GetNumberTacticFiveAnalysisForGame(game) > 16;
}

function GetNumberTacticFiveAnalysisForGame(game)
{
	moves = game.get("GameMoves");
	return getTilesInline(moves);
}

function runTacticSevenAnalysisOnGame(game)
{
	return GetNumberTacticSevenAnalysisForGame(game) > 0;
}

function getBombs(moves)
{
	var bombsAt = [];
	for(var i = 0; i < moves.length; i++)
	{
		if(moves[i].get("Tile") == 11)
		{
			bombsAt.push(i);
		}
	}
	return bombsAt;
}

function findPiecesInlinePlacedAfter(moves, start)
{
	var inlineMoves = [];
	var bomb = moves[start];
	for(var i = start + 1; i < moves.length; i++)
	{
		if(moves[i].get("XPos") == bomb.get("XPos") && moves[i].get("YPos") == bomb.get("YPos"))
		{
			if(moves[i].get("Inline") && moves[i].get("Tile") != 11)
			{
				inlineMoves.push(i);
			}
		}
	}
	return inlineMoves;
}


function runContinousTest(moves, start, startDirection, tilesInLoop)
{
	var startX = moves[start].get("XPos");
	var startY = moves[start].get("YPos");
	for(var i = start; i < moves.length; i++)
	{

		//console.log("moi " + moves[i].get("Tile") + " x " + moves[i].get("XPos") + " y " + moves[i].get("YPos"));
		var curX = startX;
		var curY = startY;
		var currentDirection = startDirection;
		
		var nextTile = getNextTileFromEndIndex(currentDirection, curX, curY, moves, i);
		var inline = 0;
		while(nextTile)
		{
			//console.log("Manip started");
			if(nextTile.get("XPos") == startX && nextTile.get("YPos") == startY)
			{
				return true;
			}
			curX = nextTile.get("XPos");
			curY = nextTile.get("YPos");
			//console.log("X " + curX + " Y " + curY)
			//console.log("CD " + currentDirection)
			//console.log(nextTile.get("Tile"))
			currentDirection = getNewDirection(currentDirection, nextTile.get("Tile"));
			//console.log("LD " + currentDirection)
			nextTile = getNextTileFromEndIndex(currentDirection, curX, curY, moves, i);
			tilesInLoop.push(nextTile);
			inline++;

			//console.log("Manip Ended");
		}
		console.log("Tiles " + tilesInLoop.length)
		//console.log("Inline " + inline);
	
	}
	
	return false;
}

function canNavigateALoopFrom(moves, start, tilesInLoop)
{
	if(moves === undefined)
	{
		return false;
	}
	var startTile = moves[start].get("Tile");
	if(trackGoesEast(startTile))
	{
		console.log("East")
		if(runContinousTest(moves, start, EAST, tilesInLoop))
		{
			return true;
		}
	}
	if(trackGoesWest(startTile))
	{
		console.log("West")
		if(runContinousTest(moves, start, WEST, tilesInLoop))
		{
			return true;
		}

	}
	if(trackGoesSouth(startTile))
	{
		console.log("South")
		if(runContinousTest(moves, start, SOUTH, tilesInLoop))
		{
			return true;
		}
	}
	if(trackGoesNorth(startTile))
	{
		console.log("North")
		if(runContinousTest(moves, start, NORTH, tilesInLoop))
		{
			return true;
		}
	}

	return false; // need to add code to try to loop from piece.
}

function GetNumberTacticSevenAnalysisForGame(game)
{
	var contLoops = 0;
	var moves = game.get("GameMoves");
	var bombsAt =  getBombs(moves);
	
	if(bombsAt.length == 0)
	{
		return 0;
	}
	// find pieces in place after bomb. if piece placed in location of bomb try to go around loop. 
	for(var i = 0; i < bombsAt.length; i++)
	{
		//console.log("Before " + moves.length);
		var piecesInline = findPiecesInlinePlacedAfter(moves, bombsAt[i]);
		//console.log("After " + moves.length);
		//console.log(piecesInline)
		
		for(var x = 0; x < piecesInline.length; x++)
		{
			var tilesInLoop = [];
			if(canNavigateALoopFrom(moves, piecesInline[x], tilesInLoop))
			{
				contLoops++;
				console.log("TIL " + tilesInLoop.length);
			}
		}
	}
	return contLoops;
}

function getTilesInline(moves)
{
	totalInline = 0;
	for(var i = 0; i < moves.length; i++)
	{
		if(moves[i].get("Inline") && moves[i].get("Tile") !=11)
		{
			totalInline++;
		}
	}
	return totalInline;
}
function getTilesOutline(moves)
{
	total = 0;
	for(var i = 0; i < moves.length; i++)
	{
		if(!moves[i].get("Inline") && moves[i].get("Tile") !=11)
		{
			total++;
		}
	}
	return total;
}

function runTacticSixAnalysisOnGame(game)
{
	var moves = game.get("GameMoves");
	var firstHitTileIndex = -1;
	for(var i = 0; i < moves.length; i++)
	{
		if(moves[i].get("XPos") == 1 && moves[i].get("YPos") == 5 && moves[i].get("Inline") && moves[i].get("Tile") != 11)
		{
			firstHitTileIndex = i;
			break;
		}
	}
	if(firstHitTileIndex == -1)
	{
		return false;
	}
	var curTile = getNextTile(EAST, 1, 5, moves);
	var lastDirection =  EAST;
	var currentMove = 1;
	while(curTile)
	{
		var currentDirection = getNewDirection(lastDirection, curTile.get("Tile"))
		var curX = curTile.get("XPos");
		var curY = curTile.get("YPos");
		while(currentMove < moves.length  && !moves[currentMove].get("Inline") )
		{
			currentMove++;
		}
		if(currentMove < moves.length)
		{
			if(moves[currentMove].get("XPos") != curTile.get("XPos") || curTile.get("YPos") != moves[currentMove].get("YPos"))
			{
				return true;
			}
		}
		
		curTile = getNextTile(currentDirection, curX, curY, moves);
		if(!curTile)
		{
			return false;
		}
		var lastDirection = currentDirection;
		currentMove++;
	}
	
	return false;
}