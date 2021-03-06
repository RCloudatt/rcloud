/*
 Author: Kunal   (tc_5.1.1)
 Description:Creating a new notebook using the + icon on the top left corner of the Notebook div
 */

//Begin Test

casper.test.begin(" Creating New Notebook", 4, function suite(test) {

    var x = require('casper').selectXPath;
    var github_username = casper.cli.options.username;
    var github_password = casper.cli.options.password;
    var rcloud_url = casper.cli.options.url;
    var functions = require(fs.absolute('basicfunctions'));
    var initialcounter = 0;//store initial count of notebooks
    var newcounter = 0;//store new count of notebooks


    casper.start(rcloud_url, function () {
        casper.page.injectJs('jquery-1.10.2.js');
    });
    casper.wait(10000);

    casper.viewport(1024, 768).then(function () {
        functions.login(casper, github_username, github_password, rcloud_url);
    });

    casper.viewport(1024, 768).then(function () {
        this.wait(9000);
        console.log("validating that the Main page has got loaded properly by detecting if some of its elements are visible. Here we are checking for Shareable Link and RCLoud logo");
        functions.validation(casper);
    });

    //Get initial count of notebooks
    casper.viewport(1024, 768).then(function () {
        
        
		var initialcounter=0;
		
		var counter = 1;//counts the number of notebooks
        while (this.exists({type: 'css', path: 'ul.jqtree_common:nth-child(1) > li:nth-child(3) > ul:nth-child(2) > li:nth-child(1) > ul:nth-child(2) > li:nth-child('+counter+') > div:nth-child(1)'}) || this.exists("ul.jqtree_common:nth-child(1) > li:nth-child(3) > ul:nth-child(2) > li:nth-child(1) > ul:nth-child(2) > li:nth-child("+counter+") > ul:nth-child(2) > li:nth-child(1) > div:nth-child(1)"))
        {
            if (this.exists("ul.jqtree_common:nth-child(1) > li:nth-child(3) > ul:nth-child(2) > li:nth-child(1) > ul:nth-child(2) > li:nth-child("+counter+") > ul:nth-child(2) > li:nth-child(1) > div:nth-child(1)")){
				
				var counter2=0;
					do{
						counter2=counter2+1;
						this.wait(2000);
					}while(this.exists({type: 'css', path: "ul.jqtree_common:nth-child(1) > li:nth-child(3) > ul:nth-child(2) > li:nth-child(1) > ul:nth-child(2) > li:nth-child("+counter+") > ul:nth-child(2) > li:nth-child("+counter2+") > div:nth-child(1)"}))
					initialcounter= initialcounter+counter2-1;
				}
			else{
				initialcounter=initialcounter+1;			
            }
            counter = counter + 1;
            this.wait(2000);
        } 
        
        
        this.echo("Initial count of Notebooks= " + initialcounter);
        
        
        this.wait(4000);
    });
    

    //Create a new Notebook.
    functions.create_notebook(casper);

    //Get new count of notebooks
    casper.viewport(1024, 768).then(function () {
        
        
		var newcounter=0;
		
		var counter = 1;//counts the number of notebooks
        while (this.exists({type: 'css', path: 'ul.jqtree_common:nth-child(1) > li:nth-child(3) > ul:nth-child(2) > li:nth-child(1) > ul:nth-child(2) > li:nth-child('+counter+') > div:nth-child(1)'}) || this.exists("ul.jqtree_common:nth-child(1) > li:nth-child(3) > ul:nth-child(2) > li:nth-child(1) > ul:nth-child(2) > li:nth-child("+counter+") > ul:nth-child(2) > li:nth-child(1) > div:nth-child(1)"))
        {
            if (this.exists("ul.jqtree_common:nth-child(1) > li:nth-child(3) > ul:nth-child(2) > li:nth-child(1) > ul:nth-child(2) > li:nth-child("+counter+") > ul:nth-child(2) > li:nth-child(1) > div:nth-child(1)")){
				
				var counter2=0;
					do{
						counter2=counter2+1;
						this.wait(2000);
					}while(this.exists({type: 'css', path: "ul.jqtree_common:nth-child(1) > li:nth-child(3) > ul:nth-child(2) > li:nth-child(1) > ul:nth-child(2) > li:nth-child("+counter+") > ul:nth-child(2) > li:nth-child("+counter2+") > div:nth-child(1)"}))
					newcounter= newcounter+counter2-1;
				}
			else{
				newcounter=newcounter+1;			
            }
            counter = counter + 1;
            this.wait(2000);
        } 
        
        
        this.echo("New count of Notebooks= " + newcounter);
        
        this.test.assertNotEquals(newcounter, initialcounter, "Confirmed that new notebook has been created");
    });
      
    casper.run(function () {
        test.done();
    });
});
