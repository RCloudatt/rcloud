Notebook.Cell.create_html_view = function(cell_model)
{
    var notebook_cell_div  = $("<div class='notebook-cell'></div>");

    //////////////////////////////////////////////////////////////////////////
    // button bar
    var source_button = $("<span class='fontawesome-button'><i class='icon-edit' alt='Show Source'></i></span>");
    var result_button = $("<span class='fontawesome-button'><i class='icon-picture' alt='Show Result'></i></span>");
    var hide_button   = $("<span class='fontawesome-button'><i class='icon-resize-small' alt='Hide cell'></i></span>");
    var remove_button = $("<span class='fontawesome-button'><i class='icon-trash' alt='Remove cell'></i></span>");
    var run_md_button = $("<span class='fontawesome-button'><i class='icon-repeat' alt='Re-execute'></i></span>");

    function update_model() {
        cell_model.content(widget.getSession().getValue());
    }
    function enable(el) {
        el.removeClass("button-disabled");
    }
    function disable(el) {
        el.addClass("button-disabled");
    }

    source_button.click(function(e) {
        if (!$(e.currentTarget).hasClass("button-disabled")) {
            result.show_source();
        }
    });
    result_button.click(function(e) {
        if (!$(e.currentTarget).hasClass("button-disabled"))
            result.show_result();
    });
    hide_button.click(function(e) {
        if (!$(e.currentTarget).hasClass("button-disabled"))
            result.hide_all();
    });
    remove_button.click(function(e) {
        if (!$(e.currentTarget).hasClass("button-disabled")) {
            cell_model.parent_model.controller.remove_cell(cell_model);
        }
    });
    run_md_button.click(function(e) {
        r_result_div.html("Computing...");
        update_model();
        result.show_result();
        cell_model.controller.execute();
    });

    // Ace sets its z-index to be 1000; 
    // "and thus began the great z-index arms race of 2012"
    var button_float = $("<div style='position:relative; float: right; z-index:10000'></div>");
    var row1 = $("<div style='margin:0.5em;'></div>");
    var editor_row = $("<div style='margin:0.5em;'></div>");
    row1.append(source_button);
    row1.append(result_button);
    row1.append(hide_button);
    row1.append(remove_button);
    button_float.append(row1);
    editor_row.append(run_md_button);
    editor_row.hide();
    button_float.append(editor_row);

    notebook_cell_div.append(button_float);

    //////////////////////////////////////////////////////////////////////////

    var inner_div = $("<div></div>");
    var clear_div = $("<div style='clear:both;'></div>");
    notebook_cell_div.append(inner_div);
    notebook_cell_div.append(clear_div);

    var markdown_div = $('<div style="position: relative; width:100%; height:100%"></div>');
    var cell_buttons_div = $('<div style="position: absolute; right:-0.5em; top:-0.5em"></div>');
    var insert_cell_button = $('<span class="fontawesome-button"><i class="icon-plus-sign"></i>');
    inner_div.append(cell_buttons_div);
    cell_buttons_div.append(insert_cell_button);
    insert_cell_button.click(function(e) {
        // this is truly the wrong way to go about things
        var base_index = notebook_cell_div.index();
        var model_index = base_index - 2;
        shell.insert_markdown_cell_before(model_index);
    });
    
    var ace_div = $('<div style="width:100%; height:100%"></div>');
    inner_div.append(markdown_div);
    markdown_div.append(ace_div);
    var widget = ace.edit(ace_div[0]);
    widget.setTheme("ace/theme/chrome");
    widget.getSession().setUseWrapMode(true);
    widget.resize();

    var r_result_div = $('<div class="r-result-div"></div>');
    inner_div.append(r_result_div);

    var result = {

        //////////////////////////////////////////////////////////////////////
        // pubsub event handlers

        content_updated: function() {
            widget.getSession().setValue(cell_model.content());
        },
        self_removed: function() {
            notebook_cell_div.remove();
        },
        result_updated: function(r) {
            r_result_div.html(r.value[0]);

            // There's a list of things that we need to do to the output:
            var uuid = rcloud.wplot_uuid;

            // capture interactive graphics
            inner_div.find("pre code")
                .contents()
                .filter(function() {
                    return this.nodeValue.indexOf(uuid) !== -1;
                }).parent().parent()
                .each(function() {
                    var uuids = this.childNodes[0].childNodes[0].data.substr(8,73).split("|");
                    var that = this;
                    rcloud.resolve_deferred_result(uuids[1], function(data) {
                        $(that).replaceWith(function() {
                            return shell.handle(data.value[0].value[0], data);
                        });
                    });
                });
            // highlight R
            inner_div
                .find("pre code")
                .each(function(i, e) {
                    hljs.highlightBlock(e);
                });
            
            // typeset the math
            MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
                
            this.show_result();
        },

        //////////////////////////////////////////////////////////////////////

        show_source: function() {
            notebook_cell_div.css({'height': '70%'});
            disable(source_button);
            enable(result_button);
            enable(hide_button);
            enable(remove_button);
            editor_row.show();

            markdown_div.show();
            widget.resize();
            r_result_div.hide();
            widget.focus();
        },
        show_result: function() {
            notebook_cell_div.css({'height': ''});
            enable(source_button);
            disable(result_button);
            enable(hide_button);
            enable(remove_button);

            editor_row.hide();
            markdown_div.hide();
            r_result_div.show();
        },
        hide_all: function() {
            notebook_cell_div.css({'height': ''});
            enable(source_button);
            enable(result_button);
            disable(hide_button);
            enable(remove_button);

            editor_row.hide();
            markdown_div.hide();
            r_result_div.hide();
        },
        remove_self: function() {
            cell_model.parent_model.remove_cell(cell_model);            
            notebook_cell_div.remove();
        },
        div: function() {
            return notebook_cell_div;
        }
    };

    result.show_result();
    result.content_updated();
    return result;
};
