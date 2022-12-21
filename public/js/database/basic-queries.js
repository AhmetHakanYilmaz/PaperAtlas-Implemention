/*
Here we are just creating the Cypher queries
*/

var basicQueries = {
  getAuthorAndPapers: function (author) {
    return `MATCH (a:Author) WHERE a.name CONTAINS "${author}"
            WITH a 
            MATCH (:Author {authorId: a.authorId})-[r]-(p:Paper) 
            RETURN a,p,r`;
  },
  getPaperAndPapers: function (paper, lengthLimit) {
    return `MATCH (p:Paper) WHERE p.title CONTAINS "${paper}"
            WITH p 
            MATCH a= (n:Paper {paperId: p.paperId})-[*..${lengthLimit}]-(pp:Paper) 
            RETURN nodes(a), relationships(a)`;
  },
  getNeighborOfPaper: function (title, lengthLimit) {
    return (
      "MATCH p=(a:Paper {title: '" +
      title +
      "'})-[r:`a-reference-of`*.." +
      lengthLimit +
      "]->(c:Paper)" +
      " RETURN nodes(p) as pathNodes ,r"
    );
  },
};
module.exports = basicQueries;
