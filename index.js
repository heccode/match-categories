const proxyurl = "https://cors-anywhere.herokuapp.com/";

const cleanName = str => {
  return str.toLowerCase().trim()
}

const comparer = anotherArr => current => anotherArr.filter(other => other.id == current.categoryId).length == 0

const getData = async url => { 
  try {
    const response = await fetch(proxyurl + url)
    const contents = await response.json()
    return contents
  } catch (err) {
    console.log(`Can't access ${url} response. Blocked by browser?`)
  }
}

const init = async () => {
  
  // Axuliar object
  let newObject = {}
  // New Arrays of Object Simplified and Ordered
  let treeDataSimplified = []
  let seoTextDataOrdered = []
  // Report for Case 1: Categories with name changed
  let nameChanged = []
  // Report for Case 2: Categories IDs not founds
  let notFounds = []

  try {
    const seoTextData = await getData('https://www.plazavea.com.pe/files/seoText.json')
    const treeData = await getData('https://www.plazavea.com.pe/api/catalog_system/pub/category/tree/3')

    // Push data inside treeDataSimplified
    treeData.forEach(({ id, name, hasChildren, children, url, Title, MetaTagDescription }) => {
      treeDataSimplified.push({
        id,
        name,
        hasChildren,
        url,
        Title,
        MetaTagDescription
      })

      if (hasChildren) {
        children.forEach(({ id, name, hasChildren, children, url, Title, MetaTagDescription }) => {
          treeDataSimplified.push({
            id,
            name,
            hasChildren,
            url,
            Title,
            MetaTagDescription
          })

          if (hasChildren) {
            children.forEach(({ id, name, hasChildren, children, url, Title, MetaTagDescription }) => {
              treeDataSimplified.push({
                id,
                name,
                hasChildren,
                url,
                Title,
                MetaTagDescription
              })
            })
          }
        })
      }
    })

    // Ordering treeDataSimplified by id key
    treeDataSimplified.sort((a, b) => parseInt(a.id) < parseInt(b.id) ? -1 : 1)

    // Ordering seoTextDataOrdered by categoryId key
    seoTextDataOrdered = seoTextData.electro.sort((a, b) => parseInt(a.categoryId) < parseInt(b.categoryId) ? -1 : 1)
    
    seoTextDataOrdered.forEach(item => {
      treeData.forEach(treeItem => {
        // Find in base level, not children
        console.log('finding base level')
        if (treeItem.id == item.categoryId) {
          if (cleanName(treeItem.name) !== cleanName(item.categoryName)) {
            newObject = {
              seoTextCat: item,
              treeDataCat: {
                id: treeItem.id,
                MetaTagDescription: treeItem.MetaTagDescription,
                Title: treeItem.Title,
                hasChildren: treeItem.hasChildren,
                name: treeItem.name,
                url: treeItem.url
              }
            }

            nameChanged.push(newObject)
          }
        }
        
        // Find in first level children
        if (treeItem.hasChildren) {
          console.log('finding sublevel 1')
          treeItem.children.forEach(treeItemChildLvl1 => {
            if (treeItemChildLvl1.id == item.categoryId) {
              if (cleanName(treeItemChildLvl1.name) !== cleanName(item.categoryName)) {
                newObject = {
                  seoTextCat: item,
                  treeDataCat: {
                    id: treeItemChildLvl1.id,
                    MetaTagDescription: treeItemChildLvl1.MetaTagDescription,
                    Title: treeItemChildLvl1.Title,
                    hasChildren: treeItemChildLvl1.hasChildren,
                    name: treeItemChildLvl1.name,
                    url: treeItemChildLvl1.url
                  }
                }

                nameChanged.push(newObject)
              }
            }

            // Find in second level children
            if (treeItemChildLvl1.hasChildren) {
              console.log('finding sublevel 2')
              treeItemChildLvl1.children.forEach(treeItemChildLvl2 => {
                if (treeItemChildLvl2.id == item.categoryId) {
                  if (cleanName(treeItemChildLvl2.name) !== cleanName(item.categoryName)) {
                    newObject = {
                      seoTextCat: item,
                      treeDataCat: {
                        id: treeItemChildLvl2.id,
                        MetaTagDescription: treeItemChildLvl2.MetaTagDescription,
                        Title: treeItemChildLvl2.Title,
                        hasChildren: treeItemChildLvl2.hasChildren,
                        name: treeItemChildLvl2.name,
                        url: treeItemChildLvl2.url
                      }
                    }

                    nameChanged.push(newObject)
                  }
                  
                  // Find in third level children
                  if (treeItemChildLvl2.hasChildren) {
                    console.log('finding sublevel 3')
                    treeItemChildLvl2.forEach(treeItemChildLvl3 => {
                      if (treeItemChildLvl3.id == item.categoryId) {
                        if (cleanName(treeItemChildLvl3.name) !== cleanName(item.categoryName)) {
                          newObject = {
                            seoTextCat: item,
                            treeDataCat: {
                              id: treeItemChildLvl3.id,
                              MetaTagDescription: treeItemChildLvl3.MetaTagDescription,
                              Title: treeItemChildLvl3.Title,
                              hasChildren: treeItemChildLvl3.hasChildren,
                              name: treeItemChildLvl3.name,
                              url: treeItemChildLvl3.url
                            }
                          }

                          nameChanged.push(newObject)
                        }
                      }
                    })
                  }
                }
              })
            }
          })
        }
      })
    })

    const onlyInTreeData = treeDataSimplified.filter(comparer(seoTextDataOrdered))
    const onlyInSeoTextData = seoTextDataOrdered.filter(comparer(treeDataSimplified))
    notFounds = onlyInTreeData.concat(onlyInSeoTextData)

    // Print results
    console.log('treeDataSimplified', treeDataSimplified)
    console.log('seoTextDataOrdered', seoTextDataOrdered)
    console.log('name changed', nameChanged)
    console.log('not founds', JSON.stringify(notFounds))

  } catch (err) {
    console.log(err)
  }
}

init()