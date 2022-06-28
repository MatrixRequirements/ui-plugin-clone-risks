/* Setting interfaces */

// eslint-disable-next-line no-unused-vars
namespace BoilerPlate {


    /** Server setting for plugin.
    * 
    * This you can use to save setting on an instance level (for all projects)
    * The user can edit these in the admin through the Server Setting Page
    */
    export interface IServerSettings {
        /** Server Setting example */
        myServerSetting: string;
    }     
    
    /** Project setting for plugin
    * 
    * This you can use to save setting for one specific project.
    * The user can edit these in the admin through the Project Setting Page
    */
    export interface IProjectSettings {
        /** example of a project setting */
        myProjectSetting:string; 
    }


    /** Setting for custom fields 
    * 
    * These allow a user to add parameters to custom field defined by the plugin
    * each time it is added to a category
    */

    export interface IPluginBoilerPlateFieldParameter extends IFieldParameter {
        /** example field parameter */
        myParameter: string;
    }

  
}
