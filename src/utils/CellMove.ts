
import {Cell} from '@antv/x6'
const MoveCell=(Cells:[Cell],direction:"up"|"down"|"left"|"right",add:number=1)=>{
    console.log("0000")

    if(Cells&&Cells.length>0){
        Cells.forEach((cell:any)=>{
            if(cell.shape==='edge'){
                const source=cell.getSource()
                const target=cell.getTarget()
                if(source.cell||target.cell) return
                const vertices=   cell.getVertices()
                if(vertices.length>0){
                    vertices.forEach((vertica:any)=>{
                        if(direction==='up'){
                            vertica.y=vertica.y-add
                        }
                        if(direction==='down'){
                            vertica.y=vertica.y+add
                        }
                        if(direction==='left'){
                            vertica.x=vertica.x-add
                        }
                        if(direction==='right'){
                            vertica.x=vertica.x+add
                        }

                    })
                }
                if(direction==='up'){
                    cell.setSource({x:source.x,y:source.y-add})
                    cell.setTarget({x:target.x,y:target.y-add})
                }
                if(direction==='down'){
                    cell.setSource({x:source.x,y:source.y+add})
                    cell.setTarget({x:target.x,y:target.y+add})
                }
                if(direction==='left'){
                    cell.setSource({x:source.x-add,y:source.y})
                    cell.setTarget({x:target.x-add,y:target.y})
                }
                if(direction==='right'){
                    cell.setSource({x:source.x+add,y:source.y})
                    cell.setTarget({x:target.x+add,y:target.y})
                }
                return
            }
            const pos = cell.position();
            if(direction==='up'){
                console.log(add)
                cell.position(pos.x,pos.y-add);
            }
            if(direction==='down'){
                console.log(add)
                cell.position(pos.x,pos.y+add);
            }
            if(direction==='left'){
                console.log(add)
                cell.position(pos.x-add,pos.y);
            }
            if(direction==='right'){
                console.log(add)
                cell.position(pos.x+add,pos.y);
            }

        })
    }
}

export default MoveCell
