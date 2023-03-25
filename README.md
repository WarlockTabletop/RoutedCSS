# Routed CSS
Routed CSS is a solution to organizing CSS in ReactJS applications that aims to prevent CSS name conflicts across components. 

## Examples

#### Simplifing Your CSS by adding React Boilerplate
Your ReactJS component adds some boilerplate to convert a styling selector into a unique selector
```Javascript
import React from 'react'
import CBSS from "./CBSSLoader"
const Styles = CBSS("Components/ProgressBar");
const StyleByProps = Styles.getPropsBySelector.bind(Styles)

export default function component(): React.ReactElement {
    return (
        <div {...StyleByProps(".Wrapper")}>
            <h1 {...StyleByProps(".Title")}>
              Example Title
             </h1>
             <p {...StyleByProps(".Content")}>
              
             </p>
        </div>
    )
}
```
The above code allows your CSS to be written simply as:
```CSS
.Wrapper {

}
.Title {

}
.Content {

}
```
