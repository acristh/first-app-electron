const { resolve, basename } = require('path');
const { app, Menu, Tray, dialog } = require('electron');
const Store = require('electron-store');

const schema = {
    projects:{
        type: 'array',

    },
};

const store = new Store({ schema });

// app.dock.hide();

const storeProjects = store.get('projects');
const projects = storeProjects ? JSON.parse(storeProjects) : [];
const itens = projects.map((project) => {
    return { label: project.name, click: () => spaw.sync('code', [project.path]) }
});

app.on('ready', () => {
    const tray = new Tray(resolve(__dirname, 'assets', 'iconTemplate.png'));

    const contextMenu = Menu.buildFromTemplate([
        ...itens,
        { 
            label: 'Adicionar novo projeto ...', 
            type: 'radio', 
            click: () => {
                const [path] = dialog.showOpenDialog({properties: ['openDirectory']});

                store.set('projects', [JSON.stringify([...projects, {
                    path,
                    name: basename(path)
                }])])
                console.log(projects);
            
            } 
        }
    ]);

    tray.setToolTip('This is may application');
    tray.setContextMenu(contextMenu);
})