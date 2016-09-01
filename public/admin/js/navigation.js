var NORTH = 1, EAST = 2, SOUTH = 3, WEST = 4;
function trackGoesEast(track)
{
	if(track == 1 || track == 3 || track == 6 || track == 7 || track == 8 || track == 9)
	{
		return true;
	}
	return false;
}
function trackGoesWest(track)
{
	if(track == 1 || track == 3 || track == 4 || track == 5 || track == 8 || track == 9)
	{
		return true;
	}
	return false;
}
function trackGoesNorth(track)
{
	if(track == 1 || track == 2 || track == 5 || track == 6 || track == 8 || track == 9)
	{
		return true;
	}
	return false;
}
function trackGoesSouth(track)
{
	if(track == 1 || track == 2 || track == 4 || track == 7 || track == 8 || track == 9)
	{
		return true;
	}
	return false;
}
function handleCrossTrack(incomingDirection)
{
	return incomingDirection;
}
function handleVerticalTrack(incomingDirection)
{
	if(incomingDirection == NORTH || incomingDirection == SOUTH)
	{
		return incomingDirection;
	}
	return false;
}
function handleHorizontalTrack(incomingDirection)
{
	if(incomingDirection == EAST || incomingDirection == WEST)
	{
		return incomingDirection;
	}
	return false;
}
function handleLowerLeftTurn(incomingDirection)
{
	if(incomingDirection == EAST)
	{
		return SOUTH;
	}
	if(incomingDirection == NORTH)
	{
		return WEST;
	}
	return false;
}
function handleUpperLeftTurn(incomingDirection)
{
	if(incomingDirection == EAST)
	{
		return NORTH;
	}
	if(incomingDirection == NORTH)
	{
		return WEST;
	}
	return false;
}
function handleUpperRightTurn(incomingDirection)
{
	if(incomingDirection == SOUTH)
	{
		return EAST;
	}
	if(incomingDirection == WEST)
	{
		return NORTH;
	}
	return false;
}
function handleLowerRightTurn(incomingDirection)
{
	if(incomingDirection == WEST)
	{
		return SOUTH;
	}
	if(incomingDirection == NORTH)
	{
		return EAST;
	}
	return false;
}
function handleTile8(incomingDirection)
{
	switch(incomingDirection)
	{
		case EAST:
			return NORTH;
			break;
		case WEST:
			return SOUTH;
			break;
		case NORTH:
			return EAST;
			break;
		case SOUTH:
			return WEST;
			break;

	}
	return false;
}
function handleTile9(incomingDirection)
{
	switch(incomingDirection)
	{
		case EAST:
			return SOUTH;
			break;
		case WEST:
			return NORTH;
			break;
		case NORTH:
			return WEST;
			break;
		case SOUTH:
			return EAST;
			break;

	}
	return false;
}
function getNewDirection(incomingDirection, tile)
{
	switch(tile)
	{
		case 1:
			return handleCrossTrack(incomingDirection);
			break;
		case 2:
			return handleVerticalTrack(incomingDirection);
			break;
		case 3: 
			return handleHorizontalTrack(incomingDirection);
			break;
		case 4:
			return handleLowerLeftTurn(incomingDirection);
			break;
		case 5:
			return handleUpperLeftTurn(incomingDirection);
			break;
		case 6:
			return handleUpperRightTurn(incomingDirection);
			break;
		case 7:
			return handleLowerRightTurn(incomingDirection);
			break;
		case 8:
			return handleTile8(incomingDirection);
			break;
		case 9:
			return handleTile9(incomingDirection);
			break;
	}
	return false;
}
function getNextTileFromEndIndex(currentDirection, curX, curY, moves, end)
{

	if(currentDirection == EAST)
	{
		curX++;
		if(curX > 7)
		{
			return false;
		}
	}
	else if(currentDirection == WEST)
	{
		curX--;
		if(curX < 0)
		{
			return false;
		}
	}
	else if(currentDirection == NORTH)
	{
		curY--;
		if(curY < 0)
		{
			return false;
		}
	}
	else if(currentDirection == SOUTH)
	{
		curY++;
		if(curY > 7)
		{
			return false;
		}
	}
	else
	{
		return false;
	}
	for(var i = end; i >= 0; i--)
	{
		
		if(moves[i].get("XPos") == curX && moves[i].get("YPos") == curY && moves[i].get("Tile") != 11)
		{
			
			return moves[i];

		}
	}
	return false;
}

function getNextTile(currentDirection, curX, curY, moves)
{

	if(currentDirection == EAST)
	{
		curX++;
		if(curX > 7)
		{
			return false;
		}
	}
	else if(currentDirection == WEST)
	{
		curX--;
		if(curX < 0)
		{
			return false;
		}
	}
	else if(currentDirection == NORTH)
	{
		curY--;
		if(curY < 0)
		{
			return false;
		}
	}
	else if(currentDirection == SOUTH)
	{
		curY++;
		if(curY > 7)
		{
			return false;
		}
	}
	else
	{
		return false;
	}
	for(var i = 0; i < moves.length; i++)
	{
		
		if(moves[i].get("XPos") == curX && moves[i].get("YPos") == curY && moves[i].get("Tile") != 11)
		{
			
			return moves[i];

		}
	}
	return false;
}