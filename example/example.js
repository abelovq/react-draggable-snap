const { ReactDraggable: Draggable, React, ReactDOM } = window;

// import './drag.css';

class App extends React.Component {
  state = {
    activeDrags: 0,
    deltaPosition: {
      x: 0, y: 0
    },
    // controlledPosition: {
    //   x: -400, y: 200
    // },
    isSnapped: false,
    isCenteredX: false,
    isCenteredY: false,
    grid: [1, 1],
    posX: 0,
    posY: 0,
    axis: 'both',
    stopdrag: false,
    x: undefined,
    y: undefined

  };

  handleDrag = (e, ui) => {
    window.console.log('handleDrag', e.clientX, e.clientY);
    // console.log('ui', ui);
    const { x, y } = this.state.deltaPosition;
    // if (e.clientX >= 350 && e.clientY >= 400) {
    //   console.log('INNER');
    //   this.setState({ deltaPosition: { x: 400, y: 250 } });
    // } 

    this.setState({
      deltaPosition: {
        x: x + ui.deltaX,
        y: y + ui.deltaY,
      }
    });


  };

  onStart = () => {
    this.setState({ activeDrags: ++this.state.activeDrags });
  };

  onStop = () => {
    this.setState({ activeDrags: --this.state.activeDrags });
  };

  // For controlled component
  adjustXPos = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const { x, y } = this.state.controlledPosition;
    this.setState({ controlledPosition: { x: x - 10, y } });
  };

  adjustYPos = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const { controlledPosition } = this.state;
    const { x, y } = controlledPosition;
    this.setState({ controlledPosition: { x, y: y - 10 } });
  };

  onControlledDrag = (e, position) => {
    const { x, y } = position;
    // if (e.clientX >= 350 && e.clientY >= 400) {
    //   console.log('INNER');
    //   this.setState({ controlledPosition: { x: 400, y: 250 } });
    // } else {
    //   this.setState({ controlledPosition: { x, y } });
    // }

    // console.log('handleDrag');
    // const { isCenteredX, isCenteredY } = this.state;

    // this.props.onLineVisible(true);
    // const description = this.rnd;

    const verticalLine = document.querySelector('.header-lines .vert');
    const horizontalLine = document.querySelector('.header-lines .horiz');

    const {
      x: descX,
      y: descY,
      width,
      height,
      top,
      left
    } = document.querySelector('.box1').getBoundingClientRect();

    const { x: verticalLineX } = verticalLine.getBoundingClientRect();

    const { y: horizontalLineY } = horizontalLine.getBoundingClientRect();

    const descriptionCenterX = descX + width / 2;
    const descriptionCenterY = descY + height / 2;

    const calcHeight =
      Math.abs(descriptionCenterY - horizontalLineY - 320) < 30
        ? Math.abs(descriptionCenterY - horizontalLineY)
        : 30;
    const calcWidth =
      Math.abs(descriptionCenterX - verticalLineX - 320) < 30
        ? Math.abs(descriptionCenterX - verticalLineX)
        : 30;

    const checkDistanceByAxis = (e, axis) => {
      if (axis === 'x') {
        return Math.abs(e.clientX - this.state.posX) >= calcWidth
          ? true
          : false;
      }
      if (axis === 'y') {
        return Math.abs(e.clientY - this.state.posY) >= calcHeight
          ? true
          : false;
      }
      if (axis === 'xy') {
        return Math.abs(e.clientY - this.state.posY) >= calcWidth ||
          Math.abs(e.clientX - this.state.posX) >= calcHeight
          ? true
          : false;
      }
    };
    console.log('Math.abs(e.clientX - this.state.posX) >= calcWidth', Math.abs(e.clientX - this.state.posX) + '-------' + calcWidth);

    if (this.state.isCenteredX && this.state.posX === 0) {
      this.setState({ posX: e.clientX }, () => console.log(this.state.posX));
      return;
    }
    if (this.state.isCenteredY && this.state.posY === 0) {
      this.setState({ posY: e.clientY });
    }

    if (!this.state.isCenteredX && !this.state.isCenteredY) {
      this.setState({ x, y });
    }
    if (this.state.isCenteredX && !this.state.isCenteredY) {
      this.setState({ x: this.state.x, y });
    }
    if (this.state.isCenteredY && !this.state.isCenteredX) {
      this.setState({ x, y: this.state.y });
    }
    if (this.state.isCenteredY && this.state.isCenteredX) {
      this.setState({ x, y });
    }

    if (this.state.isCenteredX && checkDistanceByAxis(e, 'x')) {
      console.log('checkDistanceByAxis');
      this.setState({
        isCenteredX: false,
        posX: 0,
        axis: 'both'
      });
      return;
    }
    if (this.state.isCenteredY && checkDistanceByAxis(e, 'y')) {
      this.setState({
        isCenteredY: false,
        posY: 0,
        axis: 'both'
      });
      if (
        this.state.isCenteredX &&
        this.state.isCenteredY &&
        checkDistanceByAxis(e, 'xy')
      ) {
        this.setState({
          isCenteredY: false,
          isCenteredX: false,
          posY: 0,
          posX: 0,
          axis: 'both'
        });
      }
    } else {
      if (
        Math.abs(descriptionCenterX - verticalLineX) < calcWidth &&
        !this.state.isCenteredX
      ) {
        console.log('top ESLE', top);
        const x = verticalLineX - 61 - width / 2;
        const y = top - 157;
        window.console.log(x, y);
        this.setState({ isCenteredX: true, axis: 'y', x, y }
          // , () => {
          //   once(flag => {
          //     console.log('flag', flag);
          //     this.setState({ stopdrag: flag });
          //   });
          // }
        );

        // return true;
      }
      if (
        Math.abs(descriptionCenterY - horizontalLineY) < calcHeight &&
        !this.state.isCenteredY
      ) {
        const x = left - 320;
        const y = horizontalLineY - height / 2;
        this.setState({ isCenteredY: true, axis: 'x', x, y });
        return true;
      }
    }






  };

  onControlledDragStop = (e, position) => {
    console.log('onControlledDragStop', position);


    if (!this.state.isCenteredX && !this.state.isCenteredY) {
      this.setState({ x: position.x, y: position.y });

    }
    if (this.state.isCenteredX && !this.state.isCenteredY) {
      this.setState({ x: this.state.x, y: position.y });

    }
    if (this.state.isCenteredY && !this.state.isCenteredX) {

      this.setState({ x: this.state.x, y: this.state.y });
    }
    if (this.state.isCenteredY && this.state.isCenteredX) {

      this.setState({ x: this.state.x, y: this.state.y });
    }





    // this.onControlledDrag(e, position);
    this.onStop();
  };

  handleDragStart = e => {
    console.log('handleDragStart', e);
    if (this.state.isCenteredX) {
      this.setState({ posX: e.clientX }, () => console.log(this.state.posX));
    }
    if (this.state.isCenteredY) {
      this.setState({ posY: e.clientY });
    }
  };

  render() {
    const dragHandlers = { onStart: this.onStart, onStop: this.onStop };
    const { deltaPosition, controlledPosition } = this.state;
    return (
      <div>
        <h1>React Draggable</h1>
        <p>Active DragHandlers: {this.state.activeDrags}</p>
        <p>
          <a href="https://github.com/mzabriskie/react-draggable/blob/master/example/index.html">Demo Source</a>
        </p>
        {/* <Draggable {...dragHandlers} onDrag={this.handleDrag} position={this.state.deltaPosition}>
          <div className="box">I can be dragged anywhere</div>
        </Draggable> */}
        <div className="header-lines">
          {/* <span className="vert" hidden={isBlockDragged} />
            <span className="horiz" hidden={isBlockDragged} /> */}
          <span className="vert" />
          <span className="horiz" />
        </div>
        {/* <Draggable onDrag={this.handleDrag} {...dragHandlers} >
          <div className="box">
            <div>I track my deltas</div>
            <div>x: {deltaPosition.x.toFixed(0)}, y: {deltaPosition.y.toFixed(0)}</div>
          </div>
        </Draggable> */}
        <Draggable position={{ x: this.state.x || 0, y: this.state.y || 0 }} {...dragHandlers} onStart={this.handleDragStart} onDrag={this.onControlledDrag} axis={this.state.axis} bounds=".header-lines" onStop={this.onControlledDragStop} isSnapped={this.state.isSnapped}>
          <div className="box1">
            My position can be changed programmatically. <br />
            I have a drag handler to sync state.
            <p>
              <a href="#" onClick={this.adjustXPos}>Adjust x ({this.state.x})</a>
            </p>
            <p>
              <a href="#" onClick={this.adjustYPos}>Adjust y ({this.state.y})</a>
            </p>
          </div>
        </Draggable>
        {/* <Draggable axis="x" {...dragHandlers}>
          <div className="box cursor-x">I can only be dragged horizonally (x axis)</div>
        </Draggable>
        <Draggable axis="y" {...dragHandlers}>
          <div className="box cursor-y">I can only be dragged vertically (y axis)</div>
        </Draggable>
        <Draggable onStart={() => false}>
          <div className="box">I don't want to be dragged</div>
        </Draggable>
        <Draggable onDrag={this.handleDrag} {...dragHandlers}>
          <div className="box">
            <div>I track my deltas</div>
            <div>x: {deltaPosition.x.toFixed(0)}, y: {deltaPosition.y.toFixed(0)}</div>
          </div>
        </Draggable>
        <Draggable handle="strong" {...dragHandlers}>
          <div className="box no-cursor">
            <strong className="cursor"><div>Drag here</div></strong>
            <div>You must click my handle to drag me</div>
          </div>
        </Draggable>
        <Draggable cancel="strong" {...dragHandlers}>
          <div className="box">
            <strong className="no-cursor">Can't drag here</strong>
            <div>Dragging here works</div>
          </div>
        </Draggable>
        <Draggable grid={[25, 25]} {...dragHandlers}>
          <div className="box">I snap to a 25 x 25 grid</div>
        </Draggable>
        <Draggable grid={[50, 50]} {...dragHandlers}>
          <div className="box">I snap to a 50 x 50 grid</div>
        </Draggable>
        <Draggable bounds={{top: -100, left: -100, right: 100, bottom: 100}} {...dragHandlers}>
          <div className="box">I can only be moved 100px in any direction.</div>
        </Draggable>
        <div className="box" style={{height: '500px', width: '500px', position: 'relative', overflow: 'auto', padding: '0'}}>
          <div style={{height: '1000px', width: '1000px', padding: '10px'}}>
            <Draggable bounds="parent" {...dragHandlers}>
              <div className="box">
                I can only be moved within my offsetParent.<br /><br />
                Both parent padding and child margin work properly.
              </div>
            </Draggable>
            <Draggable bounds="parent" {...dragHandlers}>
              <div className="box">
                I also can only be moved within my offsetParent.<br /><br />
                Both parent padding and child margin work properly.
              </div>
            </Draggable>
          </div>
        </div>
        <Draggable bounds="body" {...dragHandlers}>
          <div className="box">
            I can only be moved within the confines of the body element.
          </div>
        </Draggable>
        <Draggable {...dragHandlers}>
          <div className="box" style={{position: 'absolute', bottom: '100px', right: '100px'}}>
            I already have an absolute position.
          </div>
        </Draggable>
        <Draggable defaultPosition={{x: 25, y: 25}} {...dragHandlers}>
          <div className="box">
            {"I have a default position of {x: 25, y: 25}, so I'm slightly offset."}
          </div>
        </Draggable>
        <Draggable positionOffset={{x: '-10%', y: '-10%'}} {...dragHandlers}>
          <div className="box">
            {'I have a default position based on percents {x: \'-10%\', y: \'-10%\'}, so I\'m slightly offset.'}
          </div>
      </Draggable>*/}

        {/* <Draggable position={{ x: this.state.x || 0, y: this.state.y || 0 }} {...dragHandlers} onDrag={this.onControlledDrag} axis={this.state.axis}>
          <div className="box1">
            My position can be changed programmatically. <br />
            I have a drag handler to sync state.
            <p>
              <a href="#" onClick={this.adjustXPos}>Adjust x ({this.state.x})</a>
            </p>
            <p>
              <a href="#" onClick={this.adjustYPos}>Adjust y ({this.state.y})</a>
            </p>
          </div>
        </Draggable> */}
        {/* <Draggable position={controlledPosition} {...dragHandlers} onStop={this.onControlledDragStop}>
          <div className="box">
            My position can be changed programmatically. <br />
            I have a dragStop handler to sync state.
            <p>
              <a href="#" onClick={this.adjustXPos}>Adjust x ({controlledPosition.x})</a>
            </p>
            <p>
              <a href="#" onClick={this.adjustYPos}>Adjust y ({controlledPosition.y})</a>
            </p>
          </div>
        </Draggable> */}


      </div >
    );
  }
}

ReactDOM.render(<App />, document.getElementById('container'));
