
class Start extends Scene {
    create() {
        this.engine.setTitle(this.engine.storyData.Title); // TODO: replace this text using this.engine.storyData to find the story title
        this.engine.addChoice("Begin the story");
    }

    handleChoice() {
        this.engine.gotoScene(Location, this.engine.storyData.InitialLocation); // TODO: replace this text by the initial location of the story
    }
}

class Location extends Scene {
    create(key) {
        let locationData = this.engine.storyData.Locations[key]; // TODO: use `key` to get the data object for the current story location
        this.engine.show(locationData.Body); // TODO: replace this text by the Body of the location data
        
        if (locationData.GivesItem) {
            addItem(locationData.GivesItem);
            this.engine.show(`(You received ${locationData.GivesItem}.)`);
        }

        if (locationData.HasMechanism || locationData.IsMechanism) {
            this.engine.show("Interact with piano");
        }

        if(locationData.Choices && locationData.Choices.length > 0) {
            for(let choice of locationData.Choices) { // TODO: loop over the location's Choices
                let canShow = true;
                let target = this.engine.storyData.Locations[choice.Target];

                if (choice.TakesItem && !hasItem(choice.TakesItem)) {
                    this.engine.show(`(You need ${choice.TakesItem} to do that.)`);
                    canShow = false;
                }

                if (target && target.RequiresItem && !hasItem(target.RequiresItem)) {
                    this.engine.show(`(You need ${choice.RequiresItem} to do that.)`);
                    canShow = false;
                }

                if (canShow) {
                    this.engine.addChoice(choice.Text, choice);
                }
                // TODO: add a useful second argument to addChoice so that the current code of handleChoice below works
            }
        } else {
            this.engine.addChoice("The end.")
        }
    }

    handleChoice(choice) {
        if(choice) {
            this.engine.show("&gt; "+choice.Text);
            this.engine.gotoScene(Location, choice.Target);
        } else {
            this.engine.gotoScene(End);
        }
    }
}

class End extends Scene {
    create() {
        this.engine.show("<hr>");
        this.engine.show(this.engine.storyData.Credits);
    }
}

// inventory setup

let playerInventory = [];

function hasItem(itemName) {
    return playerInventory.includes(itemName);  
}
function addItem(itemName) {
    if (!hasItem(itemName)) {
        playerInventory.push(itemName);
        console.log(`Item acquired: ${itemName}`);
    }
}




Engine.load(Start, 'myStory.json');
