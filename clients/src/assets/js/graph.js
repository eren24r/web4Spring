let graph_click_enabled = false;
let calculator;
let elt;
let pointId_;
let currentR = -1;
const points = new Map();

function on_main_load() {
  elt = document.querySelector('#graph');
  calculator = Desmos.GraphingCalculator(elt, {
    keypad: false,
    expressions: false,
    settingsMenu: false,
    zoomButtons: false,
    invertedColors: false,
    xAxisLabel: 'x',
    yAxisLabel: 'y',
    xAxisStep: 1,
    yAxisStep: 1,
  });

  calculator.setMathBounds({
    left: -7,
    right: 7,
    bottom: -7,
    top: 7
  });

  let newDefaultState = calculator.getState();
  calculator.setDefaultState(newDefaultState);
}


function drawGraphByR(r) {
  updateR(r);
  /*for (let i = 0; i < pointId_; i++) {
    calculator.removeExpression({id: 'point' + i});
  }*/
  /*points.forEach((v,k) => {
    drawPointXYRResID(v.x, v.y, v.r, v.result, k);
  });*/

  drawFig(r);

}

function drawPointXYRRes(x, y, r, result) {

  x = x * (currentR / r)
  y = y * (currentR / r) 

  calculator.setExpression({
    id: x + '' + y,
    latex: '(' + x + ', ' + y + ')',
    color: result ? Desmos.Colors.GREEN : Desmos.Colors.RED
  });
}



function drawPointXYRResID(x, y, r, result, point_id) {
  if (+currentR === +r) {
    calculator.setExpression({
      id: point_id,
      latex: '(' + x + ', ' + y + ')',
      color: result ? Desmos.Colors.PURPLE : Desmos.Colors.BLUE
    });
  }
}

function drawFig(R){
  calculator.setExpression({ id: 'triangle', latex: `\\polygon((0, ${R/2}), (${-R/2}, 0), (0, 0))`, color: Desmos.Colors.RED, opacity: 0.3});
  calculator.setExpression({ id: 'rectangle', latex: `\\polygon((0, 0), (0, ${R/2}), (${R}, ${R/2}), (${R}, 0))`, color: Desmos.Colors.RED, opacity: 0.3});
  //calculator.setExpression({id: 'circle', latex: `r<=${R/2}`, color: Desmos.Colors.RED});
  calculator.setExpression({id: 'circle2', latex: `x^{2}+y^{2}\\ <=\\left(${R}\\right)^{2}\\ \\left\\{y\\ <0\\right\\}\\left\\{x>0\\right\\}`, color: Desmos.Colors.RED});
  currentR = R;
}

function drawPointXY(x, y) {
  calculator.setExpression({
    id: 'point' + pointId_++,
    latex: '(' + x + ', ' + y + ')',
    color: Desmos.Colors.BLUE
  });
}



function updateR(r) {
  currentR = r;
}

function enable_graph() {
  if (graph_click_enabled) {
    elt.removeEventListener('click', handleGraphClick);
    graph_click_enabled = false;
  } else {
    elt.addEventListener('click', handleGraphClick);
    graph_click_enabled = true;
  }
}

function handleGraphClick (evt) {

  if (currentR <= 0.000001) {
    alert("Choose R!");
    return;
  }


  const rect = elt.getBoundingClientRect();
  const x = evt.clientX - rect.left;
  const y = evt.clientY - rect.top;

  // Note, pixelsToMath expects x and y to be referenced to the top left of
  // the calculator's parent container.
  const mathCoordinates = calculator.pixelsToMath({x: x, y: y});
  send_intersection_rq(mathCoordinates.x, mathCoordinates.y, currentR);
}

function send_intersection_rq(xValue, yValue, rValue){

  const event = new CustomEvent('onGraph', {
    detail: {
      x: xValue.toFixed(3),
      y: yValue.toFixed(3)
    }
  })
  window.dispatchEvent(event);

  /*document.getElementById('ker:x_input').value = xValue.toFixed(3);
  document.getElementById('ker:y').value = yValue.toFixed(3);*/
  drawPointXY(xValue,yValue);
}


function clearAllPoints() {
  calculator.removeExpressions(calculator.getExpressions({type: 'point'}));
}
