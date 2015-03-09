game.resources = [

	/* Graphics. 
	 * @example
	 * {name: "example", type:"image", src: "data/img/example.png"},
	 */

	 //allows program to actually use background tiles and meta tiles
	 {name: "background-tiles", type:"image", src: "data/img/background-tiles.png"},
	 {name: "meta-tiles", type:"image", src: "data/img/meta-tiles.png"},
	 //program loads orc
	 {name: "player", type:"image", src: "data/img/orcSpear.png"},
	 //program loads tower
	 {name: "tower", type:"image", src: "data/img/tower_round.svg.png"},
	 //program loads creep1 image
	 {name: "creep1", type:"image", src: "data/img/brainmonster.png"},
	 //program loads title screen
	 {name: "title-screen", type:"image", src: "data/img/title.png"},
	 //program loads experience screen
	 {name: "exp-screen", type:"image", src: "data/img/loadpic.png"},
	 {name: "gloop", type:"image", src: "data/img/gloop.png"},

	/* Atlases 
	 * @example
	 * {name: "example_tps", type: "tps", src: "data/img/example_tps.json"},
	 */
		
	/* Maps. 
	 * @example
	 * {name: "example01", type: "tmx", src: "data/map/example01.tmx"},
	 * {name: "example01", type: "tmx", src: "data/map/example01.json"},
 	 */

 	 //allows program to actually load the proper map from the map folder
 	 {name: "level01", type: "tmx", src: "data/map/test.tmx"},

	/* Background music. 
	 * @example
	 * {name: "example_bgm", type: "audio", src: "data/bgm/"},
	 */	

	/* Sound effects. 
	 * @example
	 * {name: "example_sfx", type: "audio", src: "data/sfx/"}
	 */
];
