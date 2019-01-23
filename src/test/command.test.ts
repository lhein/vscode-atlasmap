"use strict";

import * as assert from "assert";
import * as vscode from "vscode";
import * as chai from "chai";
import * as sinonChai from "sinon-chai";
import * as sinon from "sinon";

const expect = chai.expect;
chai.use(sinonChai);

describe("AtlasMap/Commands", () => {
	let sandbox: sinon.SinonSandbox;
	let inputStub: sinon.SinonStub;

	before(() => {
		sandbox = sinon.createSandbox();
		inputStub = sandbox.stub(vscode.window, "showInputBox");
	});

	after(() => {
		sandbox.restore();
	});

	describe("Open", () => {
		before(() => {
			inputStub.onFirstCall().returns("8585");
			inputStub.onSecondCall().returns("localhost");
			inputStub.onThirdCall().returns("8585");
		});

		after(() => {
			inputStub.reset();
		});

		it("works with valid inputs", async () => {
			await vscode.commands.executeCommand("atlasmap.start");
			await vscode.commands.executeCommand("atlasmap.open");
		});
	});

	describe("Start", () => {
		before(() => {
			inputStub.onFirstCall().returns("8585");
		});

		after(() => {
			inputStub.reset();
		});

		it("works with valid inputs", async () => {
			await vscode.commands.executeCommand("atlasmap.start");
		});
	});

	describe("Start", () => {

		let port = "8586";
		let errorMessageSpy = sandbox.spy(vscode.window, "showErrorMessage");

		before(() => {
			inputStub.onFirstCall().returns(port);
			inputStub.onSecondCall().returns(port);
		});

		after(() => {
			inputStub.reset();
		});

		it("detect occupied port", async () => {
			
			await vscode.commands.executeCommand("atlasmap.start");
			const detect = require('detect-port');
			const co = require('co');
			await( (await co(function *() {
				const _port = yield detect(port);
				return port == _port;
			})) == true);

			await vscode.commands.executeCommand("atlasmap.start");
			assert.ok(errorMessageSpy.calledOnceWithExactly("The port " + port + " is already occupied. Choose a different port.", sinon.match.any));
			
		});
	});
});
