// voir toutes les chambres
app.get('/chambres', (req, res) => {
    mysqlconnexion.query('SELECT * FROM chambres', (err, lignes, champs) => {
    if (!err) {
    console.log(lignes)
    res.render("chambres/chambres", {chambres : lignes})}
    })
   })

   
app.get('/chambres/index', (req, res) => {
    res.render('chambres/index', {
        title: 'Hôtel California - Système de Gestion'
    });
});