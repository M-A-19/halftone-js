(function($) {
  /*
    ======== A Handy Little QUnit Reference ========
    http://api.qunitjs.com/

    Test methods:
      module(name, {[setup][ ,teardown]})
      test(name, callback)
      expect(numberOfAssertions)
      stop(increment)
      start(decrement)
    Test assertions:
      ok(value, [message])
      equal(actual, expected, [message])
      notEqual(actual, expected, [message])
      deepEqual(actual, expected, [message])
      notDeepEqual(actual, expected, [message])
      strictEqual(actual, expected, [message])
      notStrictEqual(actual, expected, [message])
      throws(block, [expected], [message])
  */

/**
 * 'setup' method for this test group
 *
 * @return void
 */
  module('jQuery#halftone', {
    // This will run before each test in this module.
    setup: function() {
      this.canvas = $('<canvas id="myCanvas" width="100" height="100">Unsupported HTML5 canvas tag.</canvas>');
      this.elems = $('#qunit-fixture').children();
    }
  });
  
 /**
  * Check that the plugin doesn't disrupt jQuery's chainable behaviour
  *
  * @return void
  */
  test('is chainable', function() {
    expect(1);
    // Not a bad test to run on collection methods.
    strictEqual(this.canvas.halftone(), this.canvas, 'should be chainable');
  });
  
 /**
  * Check the plugin will error when applied to a non-canvas element.
  *
  * @return void
  */
  test('invalid element exception', function() {
  
  	// Arrange
    var element = $('#qunit-fixture').append("<span>Foo</span>")

    // Assert
    raises(function() {
        this.element.halftone();
    }, Error, "Plugin should throw Exception for non-canvas elements.");

  });
  
    test('create empty halftone matrix', function() {
    expect(3);
    // Not a bad test to run on collection methods.
    var mtx = $.fn.halftone.spawnMatrix(8,10);
    
    strictEqual(mtx[0].length , 10, 'matrix should have 10 rows.');
    strictEqual(mtx.length , 8, 'matrix should have 8 columns.');
    strictEqual(mtx[0][0] , undefined, 'matrix values should be undefined.');
  });

  
 /**
  * Test building a halftone matrix from CanvasRenderingContext2D instance
  *
  * @return void
  */
  test('get matrix from context', function() {
    expect(2);
    
    // Arrange
    var ctx = this.canvas[0].getContext("2d", { alpha : false });
    var sample = 8;
    var mtx = $.fn.halftone.matrixFromContext(ctx,this.canvas[0].width,this.canvas[0].height,sample);
    
    
    // Assert
    strictEqual(mtx.length , 13, 'matrix should have 13 rows.');
    // @TODO: Add another assertion that checks expected matrix data.
    ok(true,'Add another assertion that checks expected matrix data');
  }); 
  
 /**
  * Test building a halftone matrix from CanvasRenderingContext2D instance
  *
  * @return void
  */
  test('get matrix from ImageData', function() {
    expect(2);
    
    // Arrange
    var ctx = this.canvas[0].getContext("2d", { alpha : false });
    var sample = 8;
    var mtx = $.fn.halftone.matrixFromimgData(ctx.getImageData(0,0,this.canvas[0].width,this.canvas[0].height),8);
    
    // Assert
    strictEqual(mtx.length , 13, 'matrix should have 13 rows.');
    strictEqual(mtx[0].length , 13, 'matrix should have 13 cols.');
    // @TODO: Add another assertion that checks expected matrix data.
    //ok(true,'Add another assertion that checks expected matrix data');
  }); 



}(jQuery));
