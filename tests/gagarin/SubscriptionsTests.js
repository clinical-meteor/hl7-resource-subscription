describe('clinical:hl7-resources-patients', function () {
  var server = meteor();
  var client = browser(server);

  it('Consents should exist on the client', function () {
    return client.execute(function () {
      expect(Consents).to.exist;
    });
  });

  it('Consents should exist on the server', function () {
    return server.execute(function () {
      expect(Consents).to.exist;
    });
  });

});
