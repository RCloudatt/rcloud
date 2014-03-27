RCloud.UI.middle_column = (function() {
    var result = RCloud.UI.column("#middle-column, #prompt-div", 5);

    _.extend(result, {
        update: function() {
            var size = 12 - RCloud.UI.left_panel.colwidth() - RCloud.UI.right_panel.colwidth();
            result.colwidth(size);
        }
    });
    return result;
}());