let audio = {
    mute : false,
    enemies_moves : [
        new Audio("./audio/fastinvader1.wav"),
        new Audio("./audio/fastinvader2.wav"),
        new Audio("./audio/fastinvader3.wav"),
        new Audio("./audio/fastinvader4.wav")
    ],
    enemies_moves_count : 0,
    player_1_shoot_audio: new Audio("./audio/shoot.wav"),
    player_2_shoot_audio: new Audio("./audio/shoot.wav"),
    player_1_got_hit_audio : new Audio("./audio/explosion.wav"),
    player_2_got_hit_audio : new Audio("./audio/explosion.wav"),
    invader_killed_audio : new Audio("./audio/invaderkilled.wav")
}
audio.play_enemies_move = function(){
    if(audio.mute){ return ;}
    if(audio.enemies_moves_count === 4){audio.enemies_moves_count = 0}
    audio.enemies_moves[audio.enemies_moves_count].play()
    audio.enemies_moves_count++;
}
audio.player_1_shoot = function(){
    audio.player_1_shoot_audio.play()
}
audio.player_2_shoot = function(){
    audio.player_2_shoot_audio.play()
}
audio.player_1_got_hit = function(){
    audio.player_1_got_hit_audio.play()
}
audio.player_2_got_hit = function(){
    audio.player_2_got_hit_audio.play()
}
audio.invader_killed = function(){
    audio.invader_killed_audio.play()
}




let w=window,
d=document,
e=d.documentElement,
g=d.getElementsByTagName('body')[0];
let width = w.innerWidth||e.clientWidth||g.clientWidth;
let height = w.innerHeight||e.clientHeight||g.clientHeight;
let player_offset = {
    x: 50,
    y:150
}
function create_stage(parent){
    let stage_ele = document.createElement("div");
    stage_ele.id = "stage"
    parent.appendChild(stage_ele)
    return stage_ele
}
function create_ui_div(parent, className){
    let UI_ele = document.createElement("div");
    UI_ele.classList.add(className)
    parent.appendChild(UI_ele)
    return UI_ele
    
}
function create_player(parent, className){
    let player_ele = document.createElement("img");
    player_ele.className = className;
    parent.appendChild(player_ele)
    return player_ele
}

function create_bullet(parent, x, y, className){
    let bullet_ele = document.createElement("div");
    bullet_ele.className = className;
    parent.appendChild(bullet_ele)
    bullet_ele.style.left = x+"px";
    bullet_ele.style.top = y+"px";
    return bullet_ele
}


function set_player_y(ele, y){ele.style.top = y+"px"; return y}
function set_player_x(ele, x){ele.style.left = x+"px"; return x}
function center_player(player_ele, x, y){
    player_ele.style.left = x+"px";
    player_ele.style.top = y+"px";
    return player_ele
}
function add_UI_span(UI_div, text, color){
    let span = document.createElement("span")
    span.innerHTML = text
    if(color) span.style.color = color
    UI_div.appendChild(span)
    return span
}







let player_1_ui = create_ui_div(g, "left")
let player_2_ui = create_ui_div(g, "right")
let stage_ele = create_stage(g);




console.log(width, height)



function player_icon(parent, className, inner_before ,inner_after, color){
    let span = document.createElement("span")
    if(inner_before){span.innerHTML = inner_before}
    let icon = document.createElement("div")
    icon.classList.add(className)
    span.appendChild(icon)
    if(inner_after){span.innerHTML += inner_after}
    if(color) span.style.color = color    
    parent.appendChild(span)
    return span
}


function create_player_1(){
    let player_WH = 80
    let player_1 = {
        invincible : false,
        invincible_dur : 0,
        ele : create_player(stage_ele, "player1"),
        y : 0,
        x : 0,
        WH : player_WH,
        WH_half : player_WH/2,
        left_hitbox : 7,
        right_hitbox : player_WH-7,
        speed : 10,
        bullet_count : 3,
        bullet_speed : 15,
        bullets : [],
        bullet_CD : 500, 
        next_shot: 0,
        score: 0,
        lives: 3,
        UI : {
            // name_ele:add_UI_span(player_1_ui, "Player 1", "red"),
            lives_title : player_icon(player_1_ui, "player1_icon", "P1 ", ":", "red"),
            lives_ele: add_UI_span(player_1_ui, 0, "red"),         
            score_title: add_UI_span(player_1_ui, " S:", "red"),
            score_ele: add_UI_span(player_1_ui, 0, "red"), 
        },
        bullet_class : "bullet1",      
        player_class : "player1"      
    }
    player_1.add_score = function(points){ 
        player_1.score += points
        player_1.UI.score_ele.innerHTML = player_1.score
    }
    player_1.add_lives = function(lives){
        player_1.lives += lives
        player_1.UI.lives_ele.innerHTML = player_1.lives
    }
    player_1.remove_lives = function(lives){
        player_1.lives -= lives;
        player_1.UI.lives_ele.innerHTML = player_1.lives;
        audio.player_1_got_hit()
    }
    player_1.add_lives(0)
    
    player_1.x = set_player_x( player_1.ele, width/2 - player_offset.x - 300)
    player_1.y = set_player_y( player_1.ele, height - player_offset.y)
    player_1.left = function(){
        if(player_1.x + player_1.WH_half < 0){ return;}        
        let new_x = player_1.x - player_1.speed
        set_player_x(player_1.ele, new_x);
        player_1.x = new_x
    }
    player_1.right = function(){
        if(player_1.x + player_1.WH_half > width){ return;}        
        let new_x = player_1.x + player_1.speed
        set_player_x(player_1.ele, new_x);
        player_1.x = new_x
    }
    player_1.shoot = function(timestamp){
        if(player_1.next_shot < timestamp) {
            let x = player_1.x + 38
            let y = player_1.y -40
            let new_bullet = create_bullet(stage_ele, x, y, player_1.bullet_class)
            player_1.bullets.push(
                {
                    x : x,
                    y : y,
                    width : 20,
                    ele : new_bullet,
                    alive : true,
                }
            )
            player_1.next_shot = timestamp + player_1.bullet_CD
            audio.player_1_shoot()
        }
    }
    player_1.move_bullets = function(){
        if(player_1.bullets.length > 0){
            player_1.bullets.forEach(
                function(bullet, b_i){
                    if(bullet.ele){ 
                        bullet.y = bullet.y - player_1.bullet_speed
                        bullet.ele.style.top = bullet.y+"px";
                        if(bullet.y < 0){
                            stage_ele.removeChild(bullet.ele)
                            player_1.bullets.splice(b_i, 1)
                        } 
                    }
                }
            )
        }
    }

    return player_1
}
let player_1 = create_player_1()









function create_player_2(){
    let player_WH = 80
    let player_2 = {
        ele : create_player(stage_ele, "player2"),
        y : 0,
        x : 0,
        WH : player_WH,
        WH_half : player_WH/2,
        left_hitbox : 7,
        right_hitbox : player_WH-7,
        speed : 10,
        bullet_count : 3,
        bullet_speed : 15,
        bullets : [],
        bullet_CD : 500, 
        next_shot: 0,
        score: 0,
        lives: 3,    
        UI : {
            // name_ele:add_UI_span(player_2_ui, "Player 2", "red"),
            lives_title : player_icon(player_2_ui, "player2_icon", "P2 ", ":", "blue"),
            lives_ele: add_UI_span(player_2_ui, 0, "blue"),         
            score_title: add_UI_span(player_2_ui, " S:", "blue"),
            score_ele: add_UI_span(player_2_ui, 0, "blue"), 
        },
        bullet_class : "bullet2",
        player_class : "player2"      
            
    }
    player_2.add_score = function(points){ 
        player_2.score += points
        player_2.UI.score_ele.innerHTML = player_2.score
    }
    player_2.add_lives = function(lives){
        player_2.lives += lives
        player_2.UI.lives_ele.innerHTML = player_2.lives
    }
    player_2.remove_lives = function(lives){
        player_2.lives -= lives;
        player_2.UI.lives_ele.innerHTML = player_2.lives;
        audio.player_2_got_hit();
    }
    player_2.add_lives(0)

    player_2.x = set_player_x( player_2.ele, width/2 - player_offset.x)
    player_2.y = set_player_y( player_2.ele, height - player_offset.y)
    player_2.left = function(){
        if(player_2.x + player_2.WH_half < 0){ return;}
        let new_x = player_2.x - player_2.speed
        set_player_x(player_2.ele, new_x);
        player_2.x = new_x
    }
    player_2.right = function(){
        if(player_2.x + player_2.WH_half > width){ return; }   
        let new_x = player_2.x + player_2.speed
        set_player_x(player_2.ele, new_x);
        player_2.x = new_x
    }
    player_2.shoot = function(timestamp){
        if(player_2.next_shot < timestamp) {
            let x = player_2.x + 38
            let y = player_2.y -40
            let new_bullet = create_bullet(stage_ele, x, y, player_2.bullet_class)
            player_2.bullets.push(
                {
                    x : x,
                    y : y,
                    width : 20,
                    ele : new_bullet,
                    alive : true,
                }
            )
            player_2.next_shot = timestamp + player_2.bullet_CD
            audio.player_2_shoot()
        }
    }
    player_2.move_bullets = function(){
        if(player_2.bullets.length > 0){
            player_2.bullets.forEach(
                function(bullet, b_i){
                    if(bullet.ele){ 
                        bullet.y = bullet.y - player_2.bullet_speed
                        bullet.ele.style.top = bullet.y+"px";
                        if(bullet.y < 0){
                            stage_ele.removeChild(bullet.ele)
                            player_2.bullets.splice(b_i, 1)
                        } 
                    }
                }
            )
        }
    }
    return player_2
}
let player_2 = create_player_2();
















let enemy = {
    width : 80,
    height : 80, 
    half_width : 40
}

// function create_enemies(){





    let enemies = {
        step_CD : 500,
        step_factor : 0.9,
        right : false,
        next_step : 0,
        difficulty : 0,
        speed : 50,
        line_count : 8,
        rows : 4, 
        alive : 8 * 4,
        max_alive : 8 * 4,
        arr : [],
        height_incr : 90,
        width_incr : 110,
        coords : {
            x_min : 0,
            x_max : 0,
            y_min : 0,
            y_max : 0
        },
        rightest_x : 0,
        leftest_x : width + 1,
        down : false,
        random_attack_ms : 9000,
        bullets : [],
        bullet_speed : 10,
    }
    enemies.alive = enemies.line_count * enemies.rows
    enemies.max_alive = enemies.line_count * enemies.rows
    enemies.speed_incr = function(){
        // enemies.step_CD = (enemies.alive * 10) + (enemies.step_down * 10);
        // enemies.step_down = enemies.step_down - 4;
        let factor = ( enemies.alive / enemies.max_alive )
        enemies.step_CD = (enemies.step_CD ) * (1 - (factor / 2)) ;
        // enemies.step_factor = (enemies.step_factor * 2)
    }
    function create_enemy(parent, x, y){
    
        if(enemies.rightest_x < x){ enemies.rightest_x = x;}
        if(enemies.leftest_x > x){ enemies.leftest_x = x;}

        let enemy_ele = document.createElement("div");
        enemy_ele.className = "enemy";
        parent.appendChild(enemy_ele)
        enemy_ele.style.left = x+"px";
        enemy_ele.style.top = y+"px";
        enemy_ele.style.width = enemy.width+"px";
        enemy_ele.style.height = enemy.height+"px";
        return enemy_ele
    }
    enemies.renew_random_shot_time = function(timestamp){
        return (timestamp||0) + Math.floor(Math.random()* enemies.random_attack_ms );
    }
    enemies.create = function(){
        let start_width = (width / 2) - ((enemies.line_count / 2) * enemies.width_incr)//calculate position from middle of screen 
        let start_height = 0
        let rows = new Array(enemies.rows).fill(new Array(enemies.line_count).fill({}))
        enemies.arr = rows.map(function(row, r_i){
            return row.map(function(enemy, e_i){
                
                let x = enemies.width_incr * (e_i+1) + start_width
                let y = enemies.height_incr * (r_i+1) + start_height
                //set max and min coords for entire enemy group to only calculate collision when the bullets com in the right area
                if(r_i === 0 && e_i === 0){ 
                    enemies.coords.x_min = x ; 
                    enemies.coords.y_min = y ; 
                }
                if(r_i === rows.length-1 && e_i === row.length-1){ 
                    enemies.coords.x_max = x ; 
                    enemies.coords.y_max = y ; 
                }            
                return {
                    alive : true,
                    points : 100,
                    x : x,
                    y : y,
                    shoot_time : enemies.renew_random_shot_time(0),
                    ele : create_enemy(stage_ele, x, y)
                }
            })
        })
        // console.log(enemies.coords)
    }
    function move_enemy_right(){
        return function(enemy, speed){
            enemy.x = enemy.x + speed
            enemy.ele.style.left = enemy.x+"px"
        }
    }
    function move_enemy_left(){
        return function(enemy, speed){
            enemy.x = enemy.x - speed
            enemy.ele.style.left = enemy.x+"px"
        }
    }
    function move_enemy_down(){
        return function(enemy, speed){
            enemy.y = enemy.y + speed
            enemy.ele.style.top = enemy.y+"px"    
        }
    }
    enemies.move = function(timestamp){
        if(enemies.next_step < timestamp){
            
            let last_en = enemies.rightest_x + enemies.speed + enemy.width 
            let first_en = enemies.leftest_x - enemies.speed
    
            if(last_en > width){ enemies.right = false; enemies.down = true; }
            if(first_en < 0){ enemies.right = true; enemies.down = true; }

            let dir_fn 
            let down_fn
            if(enemies.right){ 
                dir_fn = move_enemy_right()
            }else{
                dir_fn = move_enemy_left()            
            }
            if(enemies.down){ 
                down_fn = move_enemy_down()
            }else{
                down_fn = function(){}            
            }
            // console.log(dir_fn, down_fn)
            enemies.arr.map(function(arr_row){
                arr_row.map(function(ene){
                    dir_fn(ene, enemies.speed)
                    down_fn(ene, enemies.speed)
                })
            })
            audio.play_enemies_move()        
            if(enemies.down){
                enemies.down = false;
                enemies.speed_incr()
            }
            // if(enemies.right){
            //     if(first_en.x + enemies.speed < width)
            //     enemies.arr.x = enemies.arr.x + enemies.step.speed
                
            // }else{
            //     enemies.arr.x = enemies.arr.x - enemies.step.speed
                
            // }

            enemies.next_step = timestamp + enemies.step_CD
        }
    }



































//     return enemies
// }

// let enemies = create_enemies();












function check_vertical(y, y_min, y_max){
    if( y >= y_min && y <= y_max) return true;
    else return false;
}
function check_horizontal(x, x_min, x_max){
    if( x >= x_min && x <= x_max) return true;
    else return false;
}
function check_bullet_collision(){
    player_1.bullets.forEach(function(bullet, b_i){
        let bullet_collided = false;
        enemies.arr.forEach(function(row_arr, r_i){
            if(bullet_collided){ return;}
            row_arr.forEach(function(ene){
                if( !ene.alive || !bullet.alive ){ return;}
                if( bullet_collided ){ return;}
                if( check_vertical(bullet.y, ene.y, ene.y + enemy.height) ){
                    if( check_horizontal(bullet.x , ene.x, ene.x + enemy.width) ){
                        bullet_collided = true;
                        stage_ele.removeChild(ene.ele)
                        stage_ele.removeChild(bullet.ele)
                        delete bullet.ele;
                        ene.alive = false;
                        enemies.alive--;
                        bullet.alive = false;
                        player_1.add_score(ene.points)
                        audio.invader_killed()                             
                        return;
                    }
                }

            })


        })

    })

    
    player_2.bullets.forEach(function(bullet, b_i){
        let bullet_collided = false;
        enemies.arr.forEach(function(row_arr, r_i){
            if(bullet_collided){ return;}
            row_arr.forEach(function(ene){
                if( !ene.alive || !bullet.alive ){ return;}
                if( bullet_collided ){ return;}
                if( check_vertical(bullet.y, ene.y, ene.y + enemy.height) ){
                    if( check_horizontal(bullet.x , ene.x, ene.x + enemy.width) ){
                        bullet_collided = true;
                        stage_ele.removeChild(ene.ele)
                        stage_ele.removeChild(bullet.ele)
                        delete bullet.ele;
                        ene.alive = false;
                        enemies.alive--;                            
                        bullet.alive = false;
                        player_2.add_score(ene.points)
                        audio.invader_killed() 
                        return;
                    }
                }

            })

        })

    })


}



function remove_the_dead(){
    let rightest_x = 0
    let leftest_x = width+1;
    let new_arr = enemies.arr.map(function(row_arr){
        return row_arr.filter(function(ene){
            if(rightest_x < ene.x){ rightest_x = ene.x;}
            if(leftest_x > ene.x){ leftest_x = ene.x;}
            if(ene.alive === true) return ene;
        })
    }).filter(function(row_arr){
        if(row_arr.length > 0){
            return row_arr;
        }
    })    
    enemies.arr = new_arr;
    enemies.rightest_x =  rightest_x; 
    enemies.leftest_x = leftest_x;

}


function enemy_shoot(ene){
    if(ene.y < height){
        let bullet = document.createElement("div")
        bullet.classList.add("enemy_bullet")    
        let random_x = Math.floor(Math.random()*enemy.width)
        let x = (ene.x + random_x);
        let y = (ene.y + enemy.height)
        bullet.style.left = x+"px"
        bullet.style.top = y+"px"
        stage_ele.appendChild(bullet)
        enemies.bullets.push({
            alive : true,
            x : x,
            y : y,
            ele : bullet
        })
    }
}
enemies.check_shoot_time = function(timestamp){
    enemies.arr.forEach(function(row_arr){
        row_arr.forEach(function(ene){
            if(timestamp > ene.shoot_time && ene.alive){
                enemy_shoot(ene)


                ene.shoot_time = enemies.renew_random_shot_time(timestamp);
                
            }
        })
    })
}

enemies.move_bullets = function(){
    enemies.bullets.forEach(function(bullet){
        if(bullet.alive){
            bullet.y = bullet.y + enemies.bullet_speed;
            if(bullet.y > height){
                bullet.alive = false
                stage_ele.removeChild(bullet.ele)
            }else{
                bullet.ele.style.top = bullet.y+"px"
            }
        }
    })
}
enemies.remove_dead_bullets = function(){
    enemies.bullets = enemies.bullets.filter(function(bullet){
        if(bullet.alive) return bullet
    })
}
enemies.detect_bullets_collide = function(){
    enemies.bullets.forEach(function(bullet){
      if(bullet.y >= player_1.y && bullet.alive){
          if(bullet.x > player_1.left_hitbox + player_1.x && bullet.x < player_1.right_hitbox  + player_1.x ){
                bullet.alive = false
                stage_ele.removeChild(bullet.ele)                
                player_1.remove_lives(1)

          }
      }  
      if(bullet.y >= player_2.y && bullet.alive){
        if(bullet.x > player_2.left_hitbox + player_2.x && bullet.x < player_2.right_hitbox  + player_2.x ){
              bullet.alive = false
              stage_ele.removeChild(bullet.ele)                
              player_2.remove_lives(1)

        }
    }        
    })
}



function paused_element(parent){
    let div = document.createElement("div");
    div.classList.add("pause");
    div.classList.add("hidden");
    parent.appendChild(div);
    let span = document.createElement("span");
    span.classList.add("blink_me")
    span.innerHTML = "-- PAUSED --"
    div.appendChild(span)
    return div
}




let game = {
    running: false,
    paused: false,
    paused_timestamp : 0,
    paused_el : paused_element(g),
    pause_last : 0,
    lvl : 1,
    next_lvl_cd : 3000,
    next_lvl_cd_incr : 3000,
    next_lvl_pause :false,
}
function toggle_pause(timestamp){
    console.log("pause")
    // if(game.pause_next < timestamp)
    if(game.paused){
        game.paused = false        
        game.paused_el.classList.remove("hidden")
    }else{
        paused_timestamp = timestamp;
        game.paused = true;
        game.paused_el.classList.add("hidden")        
    }
}
function game_paused(timestamp){
    if(game.paused){
        return game.timestamp
    }else{
        return timestamp
    }
}


var Key = {
    _pressed: {},

    P2_LEFT: "ArrowLeft",//left
    P2_SHOOT: "ArrowUp",//up
    P2_RIGHT: "ArrowRight",//right

    P1_LEFT:"a",////a
    P1_SHOOT:"z",//z
    P1_RIGHT:"e",//e
    
    PAUSE : "p",//p
    
    isDown: function(key) {
      return this._pressed[key];
    },
    
    onKeydown: function(event) {
      this._pressed[event.key] = true;
    },
    
    onKeyup: function(event) {
      delete this._pressed[event.key];
    }
};



window.addEventListener('keyup', function(event) { Key.onKeyup(event); }, false);
window.addEventListener('keydown', function(event) {  Key.onKeydown(event); }, false);

let menu = undefined;



function start_game(){
    game.running = true; 
    enemies.create();

}

function create_lvl_UI(){
    let div = document.createElement("div")
    div.classList.add("middle")

    let prefix = document.createElement("span")
    prefix.innerHTML = "lvl:"

    let lvl = document.createElement("span")
    lvl.innerHTML = game.lvl
    div.appendChild(prefix)
    div.appendChild(lvl)
    g.appendChild(div)
    return lvl
}
game.lvl_ele = create_lvl_UI()
function next_lvl(timestamp){
    if(timestamp > game.next_lvl_cd && game.next_lvl_pause === false){
        game.next_lvl_cd = game.next_lvl_cd_incr +timestamp
        game.next_lvl_pause = true
        game.lvl++;
        game.lvl_ele.innerHTML = game.lvl;
    }   
    if(timestamp > game.next_lvl_cd && game.next_lvl_pause === true ){
        // game.running = true;         
        enemies.alive = enemies.line_count * enemies.rows
        enemies.max_alive = enemies.line_count * enemies.rows        
        enemies.step_CD = 500 - ( game.lvl * 20 )         
        enemies.create();
        game.next_lvl_pause = false        

    }
    
}


function add_menu_span(UI_div, text, color, className){
    let span = document.createElement("span")
    span.innerHTML = text
    span.classList.add(className)
    if(color) span.style.color = color
    UI_div.appendChild(span)
    return span
}


function build_menu(){
    let container = create_ui_div(stage_ele, "main_menu")

    let start_game_div = create_ui_div(container, "menu_bt")
    let start_game_span = add_menu_span(start_game_div, "Start", "white", "menu_text")

    let player_1_cont = create_ui_div(container, "player_controls_cont");
    let player_2_cont = create_ui_div(container, "player_controls_cont");
    player_1_cont.classList.add("left");
    player_2_cont.classList.add("right");

    function fill_controls_container(parent, color, text_arr){
        text_arr.forEach(function(span_arr){
            if(span_arr.length === 1){
                let title_cont = create_ui_div(parent, "block")
                add_menu_span(title_cont, span_arr[0], color , "block")
            }else{
                let title_cont_sub = create_ui_div(parent, "block")
                
                let left_sp = add_menu_span(title_cont_sub, span_arr[0], color , "inline_block")
                // left_sp.classList.add("left")
                let right_sp = add_menu_span(title_cont_sub, span_arr[1], color , "inline_block")
                // right_sp.classList.add("right")
            }
        })
    }
    fill_controls_container(player_1_cont, "red",
        [
            ["player 1"],
            ["left: ", "a"],
            ["right: ", "e"],
            ["shoot: ", "z"],
        ]
    )
    fill_controls_container(player_2_cont, "blue",
        [
            ["player 2"],
            ["left: ", "leftArrow"],
            ["right: ", "rightArrow"],
            ["shoot: ", "upArrow"]
        ]
    )    
    start_game_div.addEventListener("click", function(){
        start_game()
         
         stage_ele.removeChild(container);
    }, false)
    // container.style.backgroundColor = "#eee"
    menu = container
}

function check_keys(timestamp) {

        if(game.paused){
            if (Key.isDown(Key.PAUSE)) toggle_pause(timestamp);        
        }else{
            if(player_1.lives > -1){
                if (Key.isDown(Key.P1_SHOOT)) player_1.shoot(timestamp);
                if (Key.isDown(Key.P1_LEFT)) player_1.left();
                if (Key.isDown(Key.P1_RIGHT)) player_1.right();
                
            }
            if(player_2.lives > -1){
                if (Key.isDown(Key.P2_SHOOT)) player_2.shoot(timestamp);
                if (Key.isDown(Key.P2_LEFT)) player_2.left();
                if (Key.isDown(Key.P2_RIGHT)) player_2.right();
            }
            
            if (Key.isDown(Key.PAUSE)) toggle_pause(timestamp);
        }
    
    
  };


var start = null;
function step(timestamp) {
  if (!start) start = timestamp;
  var progress = timestamp - start;
    timestamp = game_paused(timestamp) //overwrites timestamp with paused timestamp
    check_keys(timestamp)
    
    if(!game.running){
        if(!menu) build_menu()

    }else{    

        if(game.paused){

        }else{
            if(enemies.alive > 0){
                player_2.move_bullets()
                player_1.move_bullets()
                enemies.move_bullets()
                enemies.detect_bullets_collide()
                enemies.remove_dead_bullets()
                enemies.move(timestamp)
                check_bullet_collision()
                remove_the_dead()
                enemies.check_shoot_time(timestamp)
            }else{
                //start next lvl
                next_lvl(timestamp)
            }
        }    
    }
//   if (progress < 2000) {
    window.requestAnimationFrame(step);
//   }
}

window.requestAnimationFrame(step);


