// const x = Math.abs(evt.deltaX) > 40 ? (evt.deltaX > 0 ? 'right' : 'left'):'';
// const y = Math.abs(evt.deltaY) > 40 ? (evt.deltaY > 0 ? 'down' : 'up') : '';
// this.eventText += `${x} ${y}<br/>`;

function getStartPosition(e) {
  const deltaX = e.deltaX;
  const deltaY = e.deltaY;
  const finalX = e.srcEvent.pageX || e.srcEvent.screenX || 0;
  const finalY = e.srcEvent.pageY || e.srcEvent.screenY || 0;

  return {
    x: finalX - deltaX,
    y: finalY - deltaY,
  };
}

export function handleSwipe(e) {
  const edgeThreshold = 50;
  const { x } = getStartPosition(e);

  if (x >= 0 && x <= edgeThreshold) {
    // handle swipe from left edge
    console.log('swipe form left edge');
    return 'leftEdge';
  } else if (x >= window.outerWidth - edgeThreshold && x <= window.outerHeight) {
    // handle swipe from right edge
    console.log('[Registry Form] swipe form right edge');
    return 'rightEdge';
  }
}

// @HostListener('swipeleft')
// openSidenav() {
//   // open the sidenav
//   console.log('swipeleft');
// }
