export default class Logger {

    static info(message) {

        console.log(`ℹ️ INFO  : ${message}`);

    }

    static success(message) {

        console.log(`✅ PASS  : ${message}`);

    }

    static warning(message) {

        console.log(`⚠️ WARN  : ${message}`);

    }

    static error(message) {

        console.log(`❌ FAIL  : ${message}`);

    }

    static title(message) {

        console.log("\n====================================");
        console.log(message);
        console.log("====================================");

    }

}