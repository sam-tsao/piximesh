class PixiMesh {
    constructor (options){
        this.vertices = options.vertices ? options.vertices : []
        this.indices = options.indices ? options.indices : [] 
        this.colors = options.colors ?  options.colors : []
        this.drawMode = options.drawMode ? options.drawMode : PIXI.DRAW_MODES.TRIANGLES
        this.vertexShader = options.vertexShader ? options.vertexShader : `
        precision highp float;
        attribute vec2 aVertexPosition;
        attribute vec3 aColor;
        uniform mat3 translationMatrix;
        uniform mat3 projectionMatrix;
        varying vec3 vColor;
        void main() {
            gl_Position = vec4((projectionMatrix * translationMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);
            vColor = aColor;
        }
        ` 
        this.fragmentShader = options.fragmentShader ? options.fragmentShader : `
        precision highp float;
        varying vec3 vColor;
        void main() {
            vec3 col = vColor;
            gl_FragColor = vec4(col, 1.0);
         }
        `
        this.shader = PIXI.Shader.from(this.vertexShader,this.fragmentShader)

        this.geometry = new PIXI.Geometry()
        this.geometry.addAttribute("aVertexPosition",this.vertices,2)
        this.geometry.addAttribute("aColor",this.colors,3)
        if(this.indices.length != 0){
            this.geometry.addIndex(this.indices)
        }
        this.mesh = new PIXI.Mesh(this.geometry,this.shader)
        this.mesh.drawMode = this.drawMode
        this.mesh.position.set(0,0)

        this.vertexBuffer = this.mesh.geometry.getBuffer('aVertexPosition')
        this.colorBuffer = this.mesh.geometry.getBuffer('aColor')
    }
    attach(parent){
        parent.stage.addChild(this.mesh)
    }
    addVertex(x,y){
        this.vertices.push(x)
        this.vertices.push(y)
        this.vertexBuffer.update(this.vertices)
    }
    addVertices(vertices){
        vertices.forEach(v=>{
            this.vertices.push(v)
        })
        this.vertexBuffer.update(this.vertices)
    }
    updateVertices(vertices){
        this.vertexBuffer.update(vertices)
    }
    addColor(r,g,b){
        this.colors.push(r)
        this.colors.push(g)
        this.colors.push(b)
        this.colorBuffer.update(this.colors)
    }
    addColors(colors){
        colors.forEach(c=>{
            this.colors.push(c)
        })
        this.colorBuffer.update(this.colors)
    }
    updateColors(colors){
        this.colorBuffer.update(colors)
    }
}