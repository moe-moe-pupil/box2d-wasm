/* eslint-env worker */
// import { CanvasDebugDraw } from './debugDraw';
import { Helpers } from './helpers';
export const setupGame = (box2D: Record<string, any>): void => {
  const { b2_dynamicBody, b2BodyDef, b2CircleShape, b2Draw: { e_shapeBit }, b2EdgeShape, b2Fixture,
    b2Vec2, b2World, destroy, JSQueryCallback, wrapPointer } = box2D;
  const myQueryCallback = new JSQueryCallback();

  myQueryCallback.ReportFixture = (fixturePtr: any) => {
      const fixture = wrapPointer( fixturePtr, b2Fixture );
      if ( fixture.GetBody().GetType() != b2_dynamicBody ) //mouse cannot drag static bodies around
        return true;
      console.log(fixture);
      return false;
  };
  const helpers = new Helpers(box2D);
  const { createPolygonShape, createRandomPolygonShape, createChainShape } = helpers;
  // const debugDraw = new CanvasDebugDraw(box2D, helpers, ctx!).constructJSDraw();
  // debugDraw.SetFlags(e_shapeBit);
  const world = new b2World(new b2Vec2(0.0, -10.0));
  // world.SetDebugDraw(debugDraw);
  const bd_ground = new b2BodyDef();
  const groundBody = world.CreateBody(bd_ground);

  //ground edges
  const shape0 = new b2EdgeShape();
  shape0.SetTwoSided(new b2Vec2(-40.0, -6.0), new b2Vec2(40.0, -6.0));
  groundBody.CreateFixture(shape0, 0.0);
  shape0.SetTwoSided(new b2Vec2(-9.0, -6.0), new b2Vec2(-9.0, -4.0));
  groundBody.CreateFixture(shape0, 0.0);
  shape0.SetTwoSided(new b2Vec2(9.0, -6.0), new b2Vec2(9.0, -4.0));
  groundBody.CreateFixture(shape0, 0.0);

  const cshape = new b2CircleShape();
  cshape.set_m_radius(0.5);

  //falling shapes
  const ZERO = new b2Vec2(0, 0);
  const temp = new b2Vec2(0, 0);
  new Array(20).fill(undefined).forEach((_, index: number) => {
    const bd = new b2BodyDef();
    bd.set_type(b2_dynamicBody);
    bd.set_position(ZERO);
    const body = world.CreateBody(bd);
    const randomValue = Math.random();
    const shape = randomValue < 0.2 ? cshape : createRandomPolygonShape(0.5);
    body.CreateFixture(shape, 1.0);
    temp.Set(16*(Math.random()-0.5), 4.0 + 2.5*index);
    body.SetTransform(temp, 0.0);
    body.SetLinearVelocity(ZERO);
    body.SetAwake(1);
    // body.SetActive(1); // no longer exists
  });

  //static polygon and chain shapes
  {
    const verts = [];
    verts.push( new b2Vec2( 7,-1) );
    verts.push( new b2Vec2( 8,-2) );
    verts.push( new b2Vec2( 9, 3) );
    verts.push( new b2Vec2( 7, 1) );
    const polygonShape = createPolygonShape(verts);
    groundBody.CreateFixture(polygonShape, 0.0);
    
    //mirror vertices in x-axis and use for chain shape
    for (let i = 0; i < verts.length; i++)
        verts[i].set_x( -verts[i].get_x() );
    verts.reverse();
    const chainShape = createChainShape(verts, true);//true for closed loop *** some problem with this atm
    // polygonShape = createPolygonShape(verts);
    groundBody.CreateFixture(chainShape, 0.0);
  }

  // const PTM = 32;

  // const myRound = (val: number, places: number) => {
  //     let c = 1;
  //     for (let i = 0; i < places; i++)
  //       c *= 10;
  //     return Math.round(val*c)/c;
  // }

  // const getWorldPointFromPixelPoint = (pixelPoint: Point) => ({
  //   x: (pixelPoint.x - canvasOffset.x)/PTM,
  //   y: (pixelPoint.y - (canvas.height - canvasOffset.y))/PTM
  // });

  // const setViewCenterWorld = (b2vecpos: any, instantaneous: any): void => {
  //   var currentViewCenterWorld = getWorldPointFromPixelPoint( viewCenterPixel );
  //   var toMoveX = b2vecpos.get_x() - currentViewCenterWorld.x;
  //   var toMoveY = b2vecpos.get_y() - currentViewCenterWorld.y;
  //   var fraction = instantaneous ? 1 : 0.25;
  //   canvasOffset.x -= myRound(fraction * toMoveX * PTM, 0);
  //   canvasOffset.y += myRound(fraction * toMoveY * PTM, 0);
  // };
  // setViewCenterWorld( new b2Vec2(0,0), true );

  let handle: number | undefined;

  (function loop(prevMs: number) {
    const nowMs = self.performance.now();
    handle = setTimeout(loop.bind(null, nowMs), 1/60);
    const delta = nowMs-prevMs;

    world.Step(delta/1000, 3, 2);
    // TODO: draw() here would do a postMessage to the UI thread, describing objects to be rendered
    // draw();
  }(self.performance.now()));
};