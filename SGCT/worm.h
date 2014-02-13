#ifndef __WORM_H__
#define __WORM_H__

typedef struct worm_t
{
	float id;
	float direction;
} wormData;

class Worm
{
public:
	Worm(int id);
	~Worm();
	void SetColor(int r, int g, int b);
	void recvData(wormData data);
	void Update();
	void Draw();
	int getId();
private:
	bool mRegistered;
	int mId;
	bool mPosition;
	int mDirection;
	bool mAlive;
};
#endif
