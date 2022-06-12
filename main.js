const carCanvas = document.getElementById("carCanvas");
carCanvas.width=200;

const networkCanvas = document.getElementById("networkCanvas");
networkCanvas.width=300;

const carCtx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");

const road=new Road(carCanvas.width/2,carCanvas.width*0.9)

const N=1000;
const cars = generateCars(N);

let bestCar=cars[0]

const traffic=generateCars(30,1,-300,-100,2.3);

if(localStorage.getItem("bestBrain")){
    for(let i=0;i<cars.length;i++){
        cars[i].brain=JSON.parse(
            localStorage.getItem("bestBrain"));
        if(i!=0){
            NeuralNetwork.mutate(cars[i].brain,0.15)
        }
    }
    for(let i=0;i<traffic.length;i++){
        traffic[i].brain=JSON.parse(
            localStorage.getItem("bestBrain"));
            NeuralNetwork.mutate(traffic[i].brain,0.5)
    }
}



// [
//     new Car(road.getLaneCenter(1),-100,30,50,"DUMMY",2),
//     new Car(road.getLaneCenter(0),-300,30,50,"DUMMY",2),
//     new Car(road.getLaneCenter(2),-300,30,50,"DUMMY",2),
//     new Car(road.getLaneCenter(2),-500,30,50,"DUMMY",2),

// ];

animate();

function save(){
    localStorage.setItem("bestBrain",JSON.stringify(bestCar.brain));
}

function discard(){
    localStorage.removeItem("bestBrain");
}

function generateCars(N,lane=1,spawnPos=100,offsetPos=0,speed=3){
    const cars=[];
    for (let i = 0; i <=N; i++) {
        cars.push(new Car(road.getLaneCenter(lane),spawnPos+offsetPos*i,30,50,"AI",speed));
    }
    return cars;
}

function animate(time){
    for (let i = 0; i < traffic.length; i++) {
        traffic[i].update(road.borders,[]);
    }
    for (let i = 0; i < cars.length; i++) {
        cars[i].update(road.borders,traffic);
    }
   

    carCanvas.height=window.innerHeight;
    networkCanvas.height=window.innerHeight;

    carCtx.save();
    carCtx.translate(0,-bestCar.y+carCanvas.height*0.7);

    road.draw(carCtx);
    for (let i = 0; i < traffic.length; i++) {
        traffic[i].draw(carCtx,"red");
    }
    carCtx.globalAlpha=0.2;
    for (let i = 0; i < cars.length; i++) {
        cars[i].draw(carCtx,"blue");
    }

    bestCar=cars.find(
        c=>c.y==Math.min(
            ...cars.map(c=>c.y)
        ));

    carCtx.globalAlpha=1;
    bestCar.draw(carCtx,"blue",true);

    carCtx.restore();

    networkCtx.lineDashOffset=-time/50;
    Visualizer.drawNetwork(networkCtx,bestCar.brain);
    requestAnimationFrame(animate);
}