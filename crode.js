var Context, Roue, Clicme;
var rx, ry, oldfps=0, fps=0, carbe;
var angle=0,index=0;
var angle2=-Math.PI;
var aff_grille=true;
var aff_cercle=true;
var animationId = null; // Identifiant de l'animation
var pointsx=[];
var pointsy=[];
var rayonp=[];
var anglep=[];
var point_avant=[];
var vitesse_cercle=(2*Math.PI)/360;
var vitesse_roue=vitesse_cercle*3;

var Context =
{
    canvas : null,
    context : null,
    create: function(canvas_id)
	{
        this.canvas = document.getElementById(canvas_id);
        this.context = this.canvas.getContext('2d');
		this.canvas.width=window.innerWidth;
		this.canvas.height=window.innerHeight;
        return this.context;
    }
};

var Sprite = function(chemin, larg, haut)
{
	// Construct
    this.image = null;
    this.pattern = null;
	this.larg = larg;
	this.haut = haut;
	
    if (chemin != undefined && chemin != "" && chemin != null)
    {
        this.image = new Image();
        this.image.src = chemin;
        this.image.onload = function(e)
		{
            console.log("Chargement sprite ok : "+chemin);
        }
	}
    else
        console.log("Problème chargement sprite : "+chemin);
	
	this.draw = function(x, y)
    {
		Context.context.drawImage(this.image, x, y); //, this.image.width, this.image.height);
		//console.log("draw à x="+x+", y="+y);
    };
    
    this.rotate = function(x, y, angle)
    {
        Context.context.save();
		
        Context.context.translate(x, y);
        Context.context.rotate(angle);        
        Context.context.drawImage(this.image, -(this.image.width/2), -(this.image.height/2));
        
        Context.context.restore();
    };
};

function init()
{
	console.log("Spiro-carbe :-) Mais chè cazz guiste");
	
    // Initialize Canvas
    Context.create("canevas");
	
	if(!Context.context)
	{
		console.log("Mode expérimental");
		Context.context = Context.canvas.getContext('experimental-webgl');
	}
	
	if(!Context.context)
	{
		return alert('Ton browserzbew ne supporte pas WebGL, con ça...');
	}

	// Annulation de l'animation
	if(animationId)
		cancelAnimationFrame(animationId);
		
	Roue = new Sprite("ims/roue_verte.png",148,148);
	Clicme = new Sprite("ims/clic_me.png",148,148);
	//Roue.draw(window.innerWidth/2,0);
	
	rx=window.innerWidth/2;
	ry=Roue.haut/2;
	//console.log("rx="+rx+", ry="+ry);
	
	animationId = requestAnimationFrame(main);
}

function scate_fps()
{
	//console.log("fps="+fps);
	oldfps=fps;
	fps=0;
	carbe = setInterval(scate_fps,1000);
}

function main()
{
	if(fps<=0)
	{
		if(!carbe)
			carbe = setInterval(scate_fps,1000);
		else
			clearInterval(carbe);
	}
		
	
	fps++;
	//console.log("fps="+fps);

	largeur = window.innerWidth;
	hauteur = window.innerHeight;

	// eff fond (en blanc)
	Context.context.fillStyle = "#FFFFFF";
	Context.context.fillRect(0,0,largeur,hauteur);
	Context.context.lineWidth = 1;
	Context.context.strokeStyle="#CCCCCC";
	
	// traçage grille
	if(aff_grille)
	{
		i=0, larg_grille=48;
		while((larg_grille*i)<=largeur)
		{
			Context.context.beginPath();
			Context.context.moveTo(0.5+(larg_grille*i),0.5);
			Context.context.lineTo(0.5+(larg_grille*i), hauteur);
			Context.context.stroke();
			Context.context.beginPath();
			Context.context.moveTo(0.5,0.5+(larg_grille*i));
			Context.context.lineTo(largeur,0.5+(larg_grille*i));
			Context.context.stroke();
			i++;
		}
	}
	
	// interface
	Context.context.fillStyle = "#ffffcc";
	Context.context.fillRect(20,20,200,150);
	Context.context.fillRect(largeur-20-200,20,200,150);
	
	// cases à cocher
	Context.context.strokeStyle = "#000000";
	Context.context.rect(40,40,14,14);
	Context.context.stroke();
	Context.context.strokeStyle = "#000000";
	Context.context.rect(40,80,14,14);
	Context.context.stroke();
	Context.context.strokeStyle = "#FFFFFF";

	// intérieurs des cases
	if(aff_grille)
	{
		Context.context.fillStyle = "#888888";
		Context.context.fillRect(42,42,10,10);
		Context.context.fillStyle = "#FFFFFF";
	}
	
	if(aff_cercle)
	{
		Context.context.fillStyle = "#888888";
		Context.context.fillRect(42,82,10,10);
		Context.context.fillStyle = "#FFFFFF";
	}
	
	// textes interface
	Context.context.textAlign = "start";
	Context.context.font = "17px Trebuchet MS";
	Context.context.fillStyle = "#666666";
	Context.context.fillText("Afficher grille", 60,54);
	Context.context.fillText("Afficher cercle", 60,94);
	Context.context.font = "28px Trebuchet MS";
	Context.context.fillText(oldfps+" FPS", largeur-200,54);
	Context.context.font = "17px Trebuchet MS";
	if(index>0)
	{
		if(index>1)
			Context.context.fillText(index+" points", 42,134);
		else
			Context.context.fillText(index+" point", 42,134);
	}
	else
		Context.context.fillText("0 point", 42,134);
	Context.context.fillStyle = "#FFFFFF";

	// cercle
	if(aff_cercle)
	{
		Context.context.strokeStyle="#88AA88";
		Context.context.beginPath();
		if(largeur>hauteur)
			Context.context.arc(largeur/2, hauteur/2, hauteur/2, 0, 2 * Math.PI);
		else
			Context.context.arc(largeur/2, hauteur/2, largeur/2, 0, 2 * Math.PI);
		Context.context.stroke();
	}
	
	// Affichage + rotation de la roue dentée
	if(largeur>hauteur)
	{
		rx=(largeur/2) + Math.cos(angle2/2)*(hauteur/2-Roue.larg/2);
		ry=(hauteur/2) + Math.sin(angle2/2)*(hauteur/2-Roue.haut/2);
	}
	else
	{
		rx=(largeur/2) + Math.cos(angle2/2)*(largeur/2-Roue.larg/2);
		ry=(hauteur/2) + Math.sin(angle2/2)*(largeur/2-Roue.haut/2);
	}
	Roue.rotate(rx,ry,angle);
	if(index<1)
		Clicme.draw(rx-Roue.larg/2,ry-Roue.haut/2);
	
	// ecart entre deux points/cercles qui relient une trainée - + l'écart est grand, + l'exec est rapide
	//ecart_pixel=.01;
	
	// affichage + rotation des points
	for(i=0;i<index;i++)
	{
		// Affichage point d'origine, celui cliqué
		Context.context.strokeStyle="#000000";
		Context.context.beginPath();
		Context.context.arc(pointsx[i], pointsy[i], 2.5, 0, 2 * Math.PI);
		Context.context.stroke();

		index_avant=point_avant[i].x.length;
		// fermeture si le point en cours a fait un tour complet du grand cercle
		// donc tant que position <= 3 PI on ajoute des points à la trainée			
		if(point_avant[i].position<=3*Math.PI+.04)
		{
			point_avant[i].x[index_avant]=pointsx[i];
			point_avant[i].y[index_avant]=pointsy[i];
		}
		
		// affichage de la trainée de points
		Context.context.strokeStyle="#6600FF";
		for(a=0;a<index_avant;a++)
			if(a>0)
			{
				/*
				Context.context.beginPath();
				Context.context.arc(point_avant[i].x[a], point_avant[i].y[a], 1, 0, 2*Math.PI);
				Context.context.stroke();
				*/
				Context.context.beginPath();
				Context.context.moveTo(point_avant[i].x[a],point_avant[i].y[a]);
				Context.context.lineTo(point_avant[i].x[a-1],point_avant[i].y[a-1]);
				Context.context.stroke();
			}

		pointsx[i]=rx+Math.cos(anglep[i])*(rayonp[i]);
		pointsy[i]=ry+Math.sin(anglep[i])*(rayonp[i]);
		
		// rotation de l'angle de la position -à la création du point- à la vitesse de rotation dans le cercle
		// pour obtenir 1 tour de cercle et arreter le tracer + haut
		point_avant[i].position+=vitesse_cercle;
				
		// rotation pour chaque point, afin qu'il suive la roue dentée
		anglep[i]-=vitesse_roue; // (=2*PI/360)
		if(anglep[i]<=-2*Math.PI)
			anglep[i]=2*Math.PI;
	}
	
	angle-=vitesse_roue; // (=2*PI/360)
	if(angle<=-2*Math.PI)
	{
		//console.log("+1 tour | Angle de la roue = "+angle+" radians");
		angle=0;
	}
	
	angle2+=vitesse_cercle;
	if(angle2>=3*Math.PI)
	{
		//console.log("+1 tour de cercle angle2="+angle2);
		angle2=-Math.PI;
	}

	animationId = requestAnimationFrame(main);
}

function clic(event)
{
	var mousex=event.clientX;
	var mousey=event.clientY;
	
	// clic sur l'interface (20,20  200x100)
	// aff_grille
	if(mousex>40 && mousex<160 && mousey>40 && mousey<60)
	{
		if(!aff_grille)
			aff_grille=true;
		else
			aff_grille=false;
	}	
	//aff_cercle
	if(mousex>40 && mousex<170 && mousey>80 && mousey<100)
	{
		if(!aff_cercle)
			aff_cercle=true;
		else
			aff_cercle=false;
	}
	
	// clic intérieur roue dentée
	if(mousex>rx-(Roue.larg/2) && mousex<rx+(Roue.larg/2) && mousey>ry-(Roue.haut/2) && mousey<ry+(Roue.haut/2))
	{
		// creation nouveau point
		pointsx[index]=mousex;
		pointsy[index]=mousey;
		rayonp[index]=Math.sqrt((Math.abs(rx-pointsx[index])*Math.abs(rx-pointsx[index])) + (Math.abs(ry-pointsy[index])*Math.abs(ry-pointsy[index])));
		anglep[index]=Math.atan2(pointsy[index]-ry,pointsx[index]-rx);

		// Ajout d'un objet Trainee qui contiendra ce nouveau point
		point_avant[index]={x:[],y:[],position:-Math.PI}
		index++;
	}
}

$(document).ready(init);
$(window).resize(init);
$("#canevas").click(clic);