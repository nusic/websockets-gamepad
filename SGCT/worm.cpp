#include "worm.h"

Worm::Worm(int id)
{
	mAlive = false;
	mRegistered = false;
	mId = id;
}

Worm::~Worm()
{
}

int Worm::getId()
{
	return mId;
}

void Worm::SetColor(int r, int g, int b)
{
}

void Worm::Update()
{
}

void Worm::recvData(wormData data)
{
	if(mId == data.id)
	{
		mDirection = data.direction;
	}
}


