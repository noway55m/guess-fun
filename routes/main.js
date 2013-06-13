/**
 * New node file
 */
exports.index = function(req, res){

  console.log(req.user);
  //console.log(req.session)

//  if(req.user){
//
//	  res.render('main.html');
//
//  }else{
//
//	  res.redirect('/login');
//
//  }

  res.render('main.html');


};
