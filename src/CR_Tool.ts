// eslint-disable-next-line no-unused-vars
namespace CloneRisks{
    
    interface IRiskCopy {
        f:string,
        t:string
    }

    export class Tool {
        
        /** callback to show or hide the menu for a selected item or folder
        * 
        * */ 
        showMenu(itemId:string) {
            if (ml.Item.parseRef(itemId).isFolder && IC.getFieldsOfType( "risk2", ml.Item.parseRef(itemId).type ).length) {
                // show menu for risk category folders
                return true;
            }
        }

        /** callback when user executes the custom the menu entry added to items or folders 
         * 
         * */ 
        menuClicked(itemId:string) {
            let that = this;
            let st = new ItemSelectionTools();
            st.showDialog({
                selectMode: SelectMode.auto,
                linkTypes: [{type: ml.Item.parseRef(itemId).type}],
                selectionChange: function (newSelection:IReference[]) {
                    let sourceIds:string[] = [];
                    for (let sel of newSelection) {
                        if (ml.Item.parseRef(sel.to).isFolder) {
                            sourceIds = sourceIds.concat( app.getChildrenIdsRec(sel.to));
                        } else {
                            sourceIds.push(sel.to);
                        }
                    }
                    that.moveIn(sourceIds, itemId); 
                    
                },
                getSelectedItems: function () {
                    return [];
                }
            });
        }

        private async moveIn( sourceIds:string[], targetFolder:string) {
            ml.UI.BlockingProgress.Init( [{name:"Cloning items"}]);
            for (let idx=0; idx< sourceIds.length; idx++) {
                ml.UI.BlockingProgress.SetProgress(0, 100*idx/sourceIds.length);
                await this.moveOneIn( sourceIds[idx], targetFolder);
            }
            ml.UI.BlockingProgress.SetProgress(0, 100);
            // reload folder
            window.location.href = window.location.href;
        }

        private async moveOneIn( source:string, target:string) {
            let that  = this;
            let res = $.Deferred();
            let params = { copyLabels:1, targetFolder:target, targetProject: matrixSession.getProject(), reason:"copying risks"};
            restConnection.postServer( matrixSession.getProject() + "/copy/" + source, params).done( (created:any) => {
                console.log( "created: ", created.itemsAndFoldersCreated[0] );
                app.getItemAsync( source ).done( (item) => { 
                    let ups = item.upLinks?item.upLinks.map( (x)  =>  {return {t:created.itemsAndFoldersCreated[0], f:x.to}}):[];
                    let downs= item.downLinks?item.downLinks.map(  (x)  =>  {return {f:created.itemsAndFoldersCreated[0], t:x.to}}):[];
                    let links = ups.concat(downs);
                    that.createLinks(links, 0).done( () => {
                        res.resolve();
                    })
                })
            });                   
            return res;
        }

        private createLinks( links:IRiskCopy[], idx:number) {
            let that = this;
            let res = $.Deferred();
            if (idx>=links.length) {
                res.resolve();
                return res;
            }
            app.addDownLinkAsync( links[idx].f, links[idx].t).always( () => { 
                that.createLinks( links,idx+1).always ( () => {
                    res.resolve();
                });
            });

            return res;
        }

    }
}
