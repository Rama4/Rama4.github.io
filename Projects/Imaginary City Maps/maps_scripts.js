// import {cities} from './maps_data.js';

$(document).ready(function() {

    const TUTORIAL_DIALOG = "#area-description-ui";
    const TUTORIAL_PROGRESS_TEXT = "#tutorial-progress";
    
    const MAP_PARENT_AREA = ".area";
    const MAP_IMAGE = ".area img";
    const TUTORIAL_AREA_HIGHLIGHT = ".rect";
    
    const START_TOUR_BUTTON = "#start-tour-button";
    const BACK_TUTORIAL_BUTTON = "#desc-btn-back";
    const NEXT_TUTORIAL_BUTTON = "#desc-btn-next";
    const CLOSE_TUTORIAL_BUTTON = "#desc-btn-close";
    const NEXT_CITY_BUTTON = "#next-city";
    const ADD_COORDINATES_BUTTON = "#add-co-ordinates";
    
    let areas = null;
    let area_descriptions = null;
    let curr_city_index = 0;
    let curr_area_index = -1;
    let IMG_WIDTH = 0;
    let IMG_HEIGHT = 0;
    
    // nana
    function init_map() {    
        const map_id = $(MAP_IMAGE);
        IMG_WIDTH = map_id.width();
        IMG_HEIGHT = map_id.height();

        const current_city = cities[curr_city_index];
        $(MAP_IMAGE).attr("src", current_city.img_uri);
        areas = current_city.areas;
        area_descriptions = current_city.descriptions;
        
    }

    function get_string(str, convert_to_pixels = true) {
        index = str.indexOf(convert_to_pixels ? "px" : "%");
        console.log('get_string(): str=',str,'index=', index);

        if(index !== -1) {
            str = str.substring(0 , index);
            str = parseFloat(str);
            if(convert_to_pixels) 
                str = Math.round(str * IMG_WIDTH/100);
            str = str + (convert_to_pixels ? "px": "");
        }
        return str;
    }

    function convert_percentage_to_pixels(area) {
        console.log('convert_percentage_to_pixels(): Image size is', IMG_WIDTH, IMG_HEIGHT);
        var l = area.left;
        var r = area.right;
        var t = area.top;
        var b = area.bottom;
        l = get_string(area.left, false);
        console.log(l);
        r = get_string(area.right, false);
        console.log(r);
        t = get_string(area.top, false);
        console.log(t);
        b = get_string(area.bottom, false);
        console.log(b);
        return {left: l, right: r, top: t, bottom: b};

    }

    function show_curr_area() {
        if(curr_area_index == -1)
            return;
        let area = areas[curr_area_index];
        area = convert_percentage_to_pixels(area);
        $(TUTORIAL_AREA_HIGHLIGHT).css({
            left: area.left + '%',
            right: area.right + '%',
            top: area.top + '%',
            bottom: area.bottom + '%'
        });
        let left = parseFloat(area.left);
        let right = parseFloat(area.right);
        let top = parseFloat(area.top);
        let bottom = parseFloat(area.bottom);

        console.log(left, right);
        if(left > right)
            $(TUTORIAL_DIALOG).css("left", ((left - 20) * 9 / 10.0) + "%").css("right", "");
        else
            $(TUTORIAL_DIALOG).css("right", ( ((right - 20) * 9 / 10.0)) + "%").css("left", "");

        if(bottom > top)
            $(TUTORIAL_DIALOG).css("top", (top + (100 - bottom - top) / 2.0) + "%").css("bottom", "");
        else
            $(TUTORIAL_DIALOG).css("bottom", (bottom + (100 - bottom - top) / 2.0) + "%").css("top", "");
        $(TUTORIAL_DIALOG).css("position",  "absolute");
        
        $(MAP_PARENT_AREA).addClass('drawn').removeClass('draw');
    }

    function show_curr_area_desc() {
        if(curr_area_index == -1)
            return;
        let selector = "";
        selector = "#m1d1";
        $(selector).html(area_descriptions[curr_area_index].description);
    }

    function enable_disable_tour_buttons() {
        let curr_back_button_state = $(BACK_TUTORIAL_BUTTON).prop('disabled');
        let curr_next_button_state = $(NEXT_TUTORIAL_BUTTON).prop('disabled');
        if(curr_area_index <= 0 !== curr_back_button_state) {
            $(BACK_TUTORIAL_BUTTON).prop('disabled', curr_back_button_state^1);
        }
        if((curr_area_index >= areas.length -1) !== curr_next_button_state) {
            $(NEXT_TUTORIAL_BUTTON).prop('disabled', curr_next_button_state^1);
        }
    }

    function desc_btn_next_handler(e) {
        console.log("next clicked");
        e.stopImmediatePropagation();
        curr_area_index = Math.min(areas.length-1, curr_area_index+1);
        show_curr_area();
        show_curr_area_desc();
        show_tutorial_progress();
        enable_disable_tour_buttons();
        console.log("curr_area_index=", curr_area_index);
    }

    function desc_btn_back_handler(e) {
        console.log("back clicked");
        e.stopImmediatePropagation();
        curr_area_index = Math.max(0, curr_area_index-1);
        show_curr_area();
        show_curr_area_desc();
        show_tutorial_progress();
        enable_disable_tour_buttons();
        console.log("curr_area_index=", curr_area_index);
    }

    function desc_btn_close_handler(e) {
        console.log("close clicked");
        e.stopImmediatePropagation();
        curr_area_index = 0;
        enable_disable_tour_buttons();
        $(START_TOUR_BUTTON).show();
        $(MAP_IMAGE).removeClass("blur");
        $(TUTORIAL_DIALOG).hide();
        $(ADD_COORDINATES_BUTTON).hide();
        $(NEXT_CITY_BUTTON).show();
        console.log("curr_area_index=", curr_area_index);
        // remove the drawn class
        $(MAP_PARENT_AREA).removeClass('drawn');
        // update img object variable data upon this mousedown event
        imgMatrix();
        // update position object variable data passing current event data and mousedown param as true 
        positionMatrix(e, true);
    }

    function show_tutorial_progress() {
        $(TUTORIAL_PROGRESS_TEXT).html(`<p> Showing item ${curr_area_index+1} of ${areas.length}</p>`)
    }
     
    function show_tutorial_handler(e) {
        console.log("button click");
        e.stopImmediatePropagation();
        if(areas.length == 0)
            return;

        $(START_TOUR_BUTTON).hide();
        curr_area_index = 0;
        show_curr_area();
        show_curr_area_desc();
        show_tutorial_progress();
        $(TUTORIAL_DIALOG).show();

        $(BACK_TUTORIAL_BUTTON).bind("click", desc_btn_back_handler);
        $(NEXT_TUTORIAL_BUTTON).bind("click", desc_btn_next_handler);
        $(CLOSE_TUTORIAL_BUTTON).bind("click", desc_btn_close_handler);

        $(ADD_COORDINATES_BUTTON).hide();
        $(NEXT_CITY_BUTTON).hide();
        $(MAP_IMAGE).addClass("blur");
        enable_disable_tour_buttons();
        console.log("curr_area_index=", curr_area_index);
    }

    let co_ordinate_list = [];
    let saved_co_ordinate_lists = [];

    function add_coordinates_handler(e) {
        e.stopImmediatePropagation();
        console.log("add_coordinates_handler(): ", co_ordinate_list);
        saved_co_ordinate_lists.push(co_ordinate_list);
        console.log('nana');
        let r = 100.0-position.right;
        let b = 100.0-position.bottom;
        r = position.right;
        b = position.bottom;
        areas.push({
            left: position.left+"%",
            right: r+"%",
            top: position.top+"%",
            bottom: b+"%",
        });
        area_descriptions.push({
            left: 0,
            top: 0,
            description: "abc",
        });
        console.log(JSON.stringify(areas, null, 4));
        console.log(area_descriptions);
    }

    function show_next_city() {
        curr_city_index = (curr_city_index + 1) % cities.length;
        show_current_city();
    }

    function show_start_tutorial_button() {
        if(areas.length === 0) {
            $(START_TOUR_BUTTON).hide();
        }
        else {
            $(START_TOUR_BUTTON).show();
        }
    }

    // nana
    function show_current_city() {
        $(MAP_IMAGE).attr("src", cities[curr_city_index].img_uri);
        init_map();
        $(TUTORIAL_DIALOG).hide();
        $(ADD_COORDINATES_BUTTON).bind("click", add_coordinates_handler);
        $(ADD_COORDINATES_BUTTON).hide();
        show_start_tutorial_button();
    }
    
    
    $(START_TOUR_BUTTON).bind("click", show_tutorial_handler);
    $(NEXT_CITY_BUTTON).bind("click", show_next_city);
    show_current_city();


    // our updatable variable objects to use globally
    let img = {};
    let position = {};

    // image matrix function to update img object variable
    function imgMatrix() {

    // our image object inside area
    let $img = $('IMG', MAP_PARENT_AREA);

    // offset data of image
    let offset = $img.offset();

    // add/update object key data
    img.width = $img.outerWidth();
    img.height = $img.outerHeight();
    img.offsetX = offset.left - $(document).scrollLeft();
    img.offsetY = offset.top - $(document).scrollTop();

    }

    // position matrix function to update position object variable
    function positionMatrix(e, mousedown = false) {

    // if mousedown param is true... for use in 
    if (mousedown) {

        // set the top/left position object data with percentage position
        position.top = (100 / img.height) * ( (e.pageY - $(document).scrollTop()) - img.offsetY);
        position.left = (100 / img.width) * ( (e.pageX - $(document).scrollLeft()) - img.offsetX);

    }

    // set the right/bottom position object data with percentage position
    position.right = 100 - ((100 / img.width) * ((e.pageX - $(document).scrollLeft()) - img.offsetX));
    position.bottom = 100 - ((100 / img.height) * ((e.pageY - $(document).scrollTop()) - img.offsetY));

    }

    // mouse move event function in area div
    $(document).on('mousemove', MAP_PARENT_AREA, function(e) {
    // / update img object variable data upon this mousemove event
    imgMatrix();

    // if this area has draw class
    if ($(this).hasClass('draw')) {
        // update position object variable data passing current event data
        positionMatrix(e);

        // if image x cursor drag position percent is negative to mousedown x position
        if ((100 - position.bottom) < position.top) {
        // update rectange x negative positions css
        $(TUTORIAL_AREA_HIGHLIGHT, this).css({
            top: (100 - position.bottom) + '%',
            bottom: (100 - position.top) + '%'
        });
        // else if image x cursor drag position percent is positive to mousedown x position
        } else {
        // update rectange x positive positions css
        $(TUTORIAL_AREA_HIGHLIGHT, this).css({
            bottom: position.bottom + '%',
            top: position.top + '%',
        });
        }

        // if image y cursor drag position percent is negative to mousedown y position
        if ((100 - position.right) < position.left) {
        // update rectange y negative positions css
        $(TUTORIAL_AREA_HIGHLIGHT, this).css({
            left: (100 - position.right) + '%',
            right: (100 - position.left) + '%'
        });
        // else if image y cursor drag position percent is positive to mousedown y position
        } else {
        // update rectange y positive positions css
        $(TUTORIAL_AREA_HIGHLIGHT, this).css({
            right: position.right + '%',
            left: position.left + '%'
        });
        }
    }
    });

    // mouse down event function in area div
    $(document).on('mousedown', MAP_PARENT_AREA, function(e) {

    // remove the drawn class
    $(this).removeClass('drawn');

    // update img object variable data upon this mousedown event
    imgMatrix();

    // update position object variable data passing current event data and mousedown param as true 
    positionMatrix(e, true);

    $(NEXT_CITY_BUTTON).show();
    $(ADD_COORDINATES_BUTTON).hide();
    $(TUTORIAL_DIALOG).hide();
    show_start_tutorial_button();

    // update rectange xy positions css
    $(TUTORIAL_AREA_HIGHLIGHT, this).css({
        left: position.left + '%',
        top: position.top + '%',
        right: position.right + '%',
        bottom: position.bottom + '%'
    });

    // add draw class to area div to reveal rectangle
    $(this).addClass('draw');

    });

    // mouse up event function in area div
    $(document).on('mouseup', MAP_PARENT_AREA, function(e) {

    // update img object variable data upon this mouseup event
    imgMatrix();


    // if this area had draw class
    if ($(this).hasClass('draw')) {

        // update position object variable data passing current event
        positionMatrix(e);

        // math trunc on position values if x and y values are equal, basically no drawn rectangle on mouseup event
        if ((Math.trunc(position.left) === Math.trunc(100 - position.right)) && (Math.trunc(position.top) === Math.trunc(100 - position.bottom))) {
        
        // remove draw and drawn classes
        $(this).removeClass('draw drawn');

        // else if x and y values are not equal, basically a rectange has been drawn
        } else {

        $(ADD_COORDINATES_BUTTON).show();
        // add drawn class and remove draw class
        $(this).addClass('drawn').removeClass('draw');
        }
    }
    }); 

});

// on window resize function
$(window).on('resize', function(e) {
  
    // update img object variable data upon this window resize event
    imgMatrix();
  
});
  