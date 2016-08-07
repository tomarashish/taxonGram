function startIntro(){
        var intro = introJs();
          intro.setOptions({
              
            steps: [
              {   
                intro: "Web App : For metagenomics data visualization. Using D3.js 'Sunburst' to represent multiple sample hierarchial data. Sunburst representation for each sample shows concurrent transition in all on hovering or click on a node of a specific chart. "
              },
              {
                element: document.querySelector('#treeView'),
                intro: "Panel shows metagenomics hierarchial representation. Thickness of link and size of node shows the abundance. Click on node expands its child elements."
              },
                {
                element: '#saveTree',
                intro: 'Save As PNG : Click on save button saves the current state of tree in png',
                position: 'bottom'
              },
              {
                element: document.querySelector('#chart'),
                intro: "Panel : Shows metagenomics data in hierarchial form as sunburst. Hovering over sunburst changes the view in sequence panel and fades other nodes in all other sample sunburst. Click on a node zooms to that level. Click on a Save button and input name area.",
                position: 'right'
              },
              {
                element: '#saveChart',
                intro: 'Save As PNG : Click on save button saves the current state of svg as png',
                position: 'bottom'
              },
              {
                element: '#sequence',
                intro: 'Breadcrumbs Trail : Represents lineage from root till current hoverd/clicked node. Click on a particular breadcrumb will make all the sunburst to zoom to that level.'
              },
              {    
                element: '#reset',
                intro: 'Resets all the sample sunburst to root level'
              }
            ]
          });
    
          intro.onbeforechange(function(element) {
                if (this._currentStep === '8') {
                    setTimeout(function() {
                        $("#step7").addClass("open");
                });
            }
          });
    
          intro.setOption('showProgress', true);
          intro.setOption('tooltipClass', 'customDefault');
          intro.setOption('showBullets', false).start();
      }