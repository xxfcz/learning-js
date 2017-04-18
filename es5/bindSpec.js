describe('bind', function () {

    it('Creating a bound function', function () {
        (function () {
            this.x = 9;    // this refers to global "window" object here in the browser
            var module = {
                x: 81,
                getX: function () { return this.x; }
            };

            var r = module.getX(); // 81
            expect(r).toBe(81);

            var retrieveX = module.getX;
            r = retrieveX();    // returns 9 - The function gets invoked at the global scope
            expect(r).toBe(9);

            var boundGetX = retrieveX.bind(module);
            r = boundGetX(); // 81
            expect(r).toBe(81);
        })();
    });

    it('Partially applied functions', function () {
        function list() {
            return Array.prototype.slice.call(arguments);
        }

        var list1 = list(1, 2, 3); // [1, 2, 3]
        expect(list1).toEqual([1, 2, 3]);
        // Create a function with a preset leading argument
        var leadingThirtysevenList = list.bind(null, 37);

        var list2 = leadingThirtysevenList();
        // [37]
        expect(list2).toEqual([37]);

        var list3 = leadingThirtysevenList(1, 2, 3);
        // [37, 1, 2, 3]
        expect(list3).toEqual([37, 1, 2, 3]);
    });
});